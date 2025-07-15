import * as vscode from "vscode";
import * as path from "path";

import * as utils from "../utils";
import * as net from "../net";
import * as dbio from "../dbio";
import * as syncstruct from "../syncstruct";

let provider: ExplorerProvider;
export let view: vscode.TreeView<string>;
let exps: Record<string, dbio.Experiment> = {};

let root: Promise<string> = new Promise(resolve => {
	net.rpc("experiment_db", "root", []).then((data: any) => resolve(data.ret));
});

export let open = async (filename: string, classname: string) => {
	let p = path.posix.join(await root, filename);
	let uri = vscode.Uri.parse(p);
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
		name: string,
	) {
		super(name);
		let exp = exps[name];

		this.tooltip = `${exp.file}:${exp.class_name}`;
		let color = new vscode.ThemeColor("symbolIcon.classForeground");
		this.iconPath = new vscode.ThemeIcon("package", color);
		this.command = {
			command: "artiq.openExperiment",
			title: "",
			arguments: [exp.file, exp.class_name],
		};
	}
}

class ExplorerProvider implements vscode.TreeDataProvider<string> {
	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
	public refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
		vscode.window.showInformationMessage("Updated Explorer");
	}

	constructor() {}

	getTreeItem(name: string): vscode.TreeItem {
		return new ExperimentTreeItem(name);
	}

	getParent(): undefined {} // no-op must be implemented to access TreeView.reveal()

	async getChildren(name?: string): Promise<string[]> {
		if (name) { return Promise.resolve([]); }

		if (Object.keys(exps).length === 0) {
			view.message = "Populate the repository directory with experiment files ...";
			return Promise.resolve([]);
		}

		view.message = "";
		return Object.keys(exps);
	}
}

export let init = async () => {
	provider = new ExplorerProvider();
	view = vscode.window.createTreeView("explorer", {
		treeDataProvider: provider,
	});

	exps = syncstruct.from({
		channel: "explist",
		onReceive: async () => {
			let basepath = await root;
			// update "softly" to provide what is new
			// yet to sustain what was known and customized
			dbio.createAll(Object.entries(exps).map(([name, exp]) => ({
				...exp, name,
				path: path.posix.join(basepath, exp.file!),
				inRepo: true,
			})));
			provider.refresh();
		},
	});

	if (vscode.workspace.getConfiguration("artiq").get("initialScan")) {
		await scan();
	}
};

export let scan = async () => {
	vscode.window.showInformationMessage("Scanning repository directory ...");
	await net.rpc("experiment_db", "scan_repository", []);
};

let deselectAll = (names: string[]) => {
	// TODO: waiting for feature to ship
	// see https://github.com/microsoft/vscode/issues/48754
};

export let update = async () => {
	let names = Object.keys(exps);
	let curr = await dbio.curr();
	
	if (!curr || !curr.inRepo) {
		deselectAll(names);
		return;
	}

	names.includes(curr.name) ? view.reveal(curr.name) : deselectAll(names);
};