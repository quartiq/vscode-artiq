import * as vscode from "vscode";

import * as net from "../net";
import * as utils from "../utils";
import * as repo from "../repo";
import * as dbio from "../dbio";

let provider: ExplorerProvider;
let view: vscode.TreeView<ExperimentTreeItem>;
let receiver: any;
let ready = false;

export let open = async (path: string, classname: string) => {
	let uri = vscode.Uri.parse(path);
	try { await vscode.workspace.fs.stat(uri); } catch {
		vscode.window.showErrorMessage("No such file, consider rescanning ARTIQ repository");
		return;
	}

	let symbols = await utils.symbols(uri);
	let location = symbols.find(s => s.name === classname)?.location;
	if (!location) {
		vscode.window.showErrorMessage("No such class, consider rescanning ARTIQ repository");
		return;
	}

	let selection = new vscode.Selection(location.range.start, location.range.start);
	vscode.commands.executeCommand("vscode.open", location.uri, {selection});
};

class ExperimentTreeItem extends vscode.TreeItem {
	constructor(
		public readonly exp: any,
	) {
		super(exp.name);
		this.tooltip = `${exp.file}:${exp.class_name}`;
		let color = new vscode.ThemeColor("symbolIcon.classForeground");
		this.iconPath = new vscode.ThemeIcon("package", color);
		this.command = {
			command: "artiq.openExperiment",
			title: "",
			arguments: [exp.path, exp.class_name],
		};
	}
}

class ExplorerProvider implements vscode.TreeDataProvider<ExperimentTreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
	public refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	constructor() {}

	getTreeItem(element: ExperimentTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getParent(): undefined {} // no-op must be implemented to access TreeView.reveal()

	getChildren(element?: ExperimentTreeItem | undefined): Thenable<ExperimentTreeItem[]> {
		if (!ready) { return Promise.resolve([]); } // prevents the population cta from jibbering its way through for 1 second

		view.message = "";

		if (Object.values(repo.exps).length === 0) {
			view.message = "Populate the repository directory with experiment files ...";
			return Promise.resolve([]);
		}

		if (element) { return Promise.resolve([]); }

		let treeItems = Object.values(repo.exps).map(exp => new ExperimentTreeItem(exp));
		return Promise.resolve(treeItems);
	}
}

export let init = async () => {
	provider = new ExplorerProvider();
	view = vscode.window.createTreeView("explorer", {
		treeDataProvider: provider,
	});

	receiver = net.receiver(3250, "sync_struct", "explist");

	if (vscode.workspace.getConfiguration("artiq").get("initialScan")) {
		await scan();
	}

	receiver.on("data", (data: any) => {
		net.parseLines(data).forEach((msg: any) => repo.update(msg));
		provider.refresh();
		vscode.window.showInformationMessage("Updated Explorer");
	});

	repo.ready.locked.then(() => ready = true);
};

export let scan = async () => {
	vscode.window.showInformationMessage("Scanning repository directory ...");
	await net.rpc("experiment_db", "scan_repository", []);
};

let deselectAll = (items: ExperimentTreeItem[]) => {
	// TODO: waiting for feature to ship
	// see https://github.com/microsoft/vscode/issues/48754
};

export let update = async () => {
	let items = await provider.getChildren();
	let curr = await dbio.curr();
	
	if (!curr || !curr.inRepo) {
		deselectAll(items);
		return;
	}

	let item = items.find(i => i.label === curr.name);
	item ? view.reveal(item) : deselectAll(items);
};