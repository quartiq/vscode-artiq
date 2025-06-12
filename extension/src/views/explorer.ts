import * as vscode from "vscode";
import * as path from "path";

import * as net from "../net";
import * as utils from "../utils";

let provider: ExplorerProvider;
let view: vscode.TreeView<Experiment>;
let receiver: any;
let experiments: { [key: string]: Experiment } = {};
let ready = false;
let root: any;

export let open = async (filename: string, classname: string) => {
	let uri = vscode.Uri.parse(path.posix.join(root, filename));
	try { await vscode.workspace.fs.stat(uri); } catch {
		vscode.window.showErrorMessage("No such file, consider to rescan ARTIQ repository");
		return;
	}

	let symbols = await utils.symbols(uri);
	let location = symbols.find(s => s.name === classname)?.location;
	if (!location) {
		vscode.window.showErrorMessage("No such class, consider to rescan ARTIQ repository");
		return;
	}

	vscode.commands.executeCommand("vscode.open", location.uri, {selection: location.range});
};

class Experiment extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly obj: any,
	) {
		super(label);
		this.tooltip = `${obj.file}:${obj.class_name}`;
		let color = new vscode.ThemeColor("symbolIcon.classForeground");
		this.iconPath = new vscode.ThemeIcon("package", color);
		this.command = {
			command: "artiq.openExperiment",
			title: "",
			arguments: [obj.file, obj.class_name],
		};
	}
}

class ExplorerProvider implements vscode.TreeDataProvider<Experiment> {
	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
	public refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	constructor() {}

	getTreeItem(element: Experiment): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(element?: Experiment | undefined): Thenable<Experiment[]> {
		if (!ready) { return Promise.resolve([]); }
		view.message = "";

		if (Object.values(experiments).length === 0) {
			view.message = "Populate the repository directory with experiment files ...";
			return Promise.resolve([]);
		}

		if (element) { return Promise.resolve([]); }
		return Promise.resolve(Object.values(experiments));
	}
}

let evalMessage = async (msg: any) => {

	if (msg.action === "init") {
		experiments = await initExperiments(msg.struct);
		ready = true;
		provider.refresh();

	} else if (msg.action === "setitem") {
		experiments[msg.key] = new Experiment(msg.key, msg.value);
		provider.refresh();

	} else if (msg.action === "delitem") {
		delete experiments[msg.key];
		provider.refresh();
	}
};

export let init = async () => {
	provider = new ExplorerProvider();
	view = vscode.window.createTreeView("explorer", {
		treeDataProvider: provider,
	});

	receiver = await net.receiver(3250, "sync_struct", "explist");
	root = (await net.rpc("experiment_db", "root", [])).ret;

	if (vscode.workspace.getConfiguration("artiq").get("initialScan")) {
		await scan();
	}

	receiver.on("data", (data: any) => {
		net.parseLines(data).forEach((msg: any) => evalMessage(msg));
		vscode.window.showInformationMessage("Updated Explorer");
	});
};

export let scan = async () => {
	vscode.window.showInformationMessage("Scanning repository directory ...");
	await net.rpc("experiment_db", "scan_repository", []);
};

let initExperiments = async (dict: any) => {
	let out: { [key: string]: Experiment } = {};
	await Promise.all(Object.keys(dict).map(async k => {
		out[k] = new Experiment(k, dict[k]);
	}));
	
	return out;
};
