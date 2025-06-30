import * as vscode from "vscode";

import * as net from "../net";
import * as utils from "../utils";
import * as repo from "../repo";
import * as dbio from "../dbio";

let provider: ExplorerProvider;
let view: vscode.TreeView<ExperimentTreeItem>;

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
		private readonly exp: any, // FIXME tree items have an "exp" property, which is not intended
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
		vscode.window.showInformationMessage("Updated Explorer");
	}

	constructor() {}

	getTreeItem(element: ExperimentTreeItem): vscode.TreeItem {
		return element;
	}

	getParent(): undefined {} // no-op must be implemented to access TreeView.reveal()

	getChildren(element?: ExperimentTreeItem): Thenable<ExperimentTreeItem[]> {
		if (element) { return Promise.resolve([]); }

		if (Object.values(repo.exps).length === 0) {
			view.message = "Populate the repository directory with experiment files ...";
			return Promise.resolve([]);
		}

		view.message = "";
		let treeItems = Object.values(repo.exps).map(exp => new ExperimentTreeItem(exp));
		return Promise.resolve(treeItems);
	}
}

export let init = async () => {
	provider = new ExplorerProvider();
	view = vscode.window.createTreeView("explorer", {
		treeDataProvider: provider,
	});

	net.receiver(3250, "sync_struct", "explist").on("data", async (data: any) => {
		let msgs = net.parseLines(data);
		await repo.updateAll(msgs);
		provider.refresh();
	});

	if (vscode.workspace.getConfiguration("artiq").get("initialScan")) {
		await scan();
	}
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