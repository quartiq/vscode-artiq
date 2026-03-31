import * as vscode from "vscode";
import * as path from "path";

import * as net from "../net.js";
import * as experiment from "../experiment.js";

let provider: ExplorerProvider;
export let view: vscode.TreeView<ExperimentTreeItem>;

export let open = async (filename: string, classname: string) => {
	let p = path.posix.join(await experiment.repoRoot, filename);
	let uri = vscode.Uri.parse(p);
	try { await vscode.workspace.fs.stat(uri); } catch {
		vscode.window.showErrorMessage("No such file, consider rescanning ARTIQ repository");
		return;
	}

	let location = (await experiment.symbols(uri)).find(s => s.name === classname)?.location;
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
		exp: experiment.SyncInfo,
	) {
		super(name);

		this.tooltip = `${exp.file}:${exp.class_name}`;
		let color = new vscode.ThemeColor("symbolIcon.classForeground");
		this.iconPath = new vscode.ThemeIcon("package", color);
		this.command = {
			// TODO: fix editor tab on double click
			command: "artiq.openExperiment",
			title: "",
			arguments: [exp.file, exp.class_name],
		};
	}
}

class ExplorerProvider implements vscode.TreeDataProvider<ExperimentTreeItem> {
	public items = new Map<string, ExperimentTreeItem>();

	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
	public refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
		vscode.window.showInformationMessage("Updated Explorer");
	}

	constructor() {}

	getTreeItem(item: ExperimentTreeItem): vscode.TreeItem {
		return item;
	}

	getParent(): undefined {} // no-op; must be implemented to access TreeView.reveal()

	async getChildren(element?: ExperimentTreeItem): Promise<ExperimentTreeItem[]> {
		if (element) { return Promise.resolve([]); }
		
		let repo = await experiment.repo;
		if (Object.keys(repo.struct).length === 0) {
			view.message = "Populate the repository directory with experiment files ...";
			return Promise.resolve([]);
		}

		view.message = "";
		let items = Object.keys(repo.struct).map(name => {
			let item = new ExperimentTreeItem(name, repo.struct[name]);
			this.items.set(name, item);
			return item;
		});

		return items;
	}
}

export let init = async () => {
	provider = new ExplorerProvider();
	view = vscode.window.createTreeView("explorer", {
		treeDataProvider: provider,
	});

	if (vscode.workspace.getConfiguration("artiq").get("initialScan")) {
		await scan();
	}
};

export let scan = async () => {
	vscode.window.showInformationMessage("Scanning repository directory ...");
	await net.rpc("experiment_db", "scan_repository", []);
};

let deselectAll = (items: Map<string, ExperimentTreeItem>) => {
	// TODO: waiting for feature to ship
	// see https://github.com/microsoft/vscode/issues/48754
};

export let update = async (refresh?: Boolean) => {
	if (refresh) { provider.refresh(); }

	let curr = await experiment.curr();
	if (!curr) {
		deselectAll(provider.items);
		return;
	}

	if (await experiment.inRepo(curr)) {
		let item = provider.items.get(curr.name);
		item && view.reveal(item);
		return;
	}

	deselectAll(provider.items);
};