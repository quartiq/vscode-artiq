import * as vscode from "vscode";
import * as net from "../net.js";

let provider: ExplorerProvider;
let view: vscode.TreeView<Experiment>;
let receiver: any;
let experiments: { [key: string]: Experiment } = {};
let ready = false;

class Experiment extends vscode.TreeItem {
	constructor(
		public readonly label: string,
	) {
		super(label);
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

let evalMessage = (msg: any) => {

	if (msg.action === "init") {
		experiments = experimentsFromStruct(msg.struct);
		ready = true;
		provider.refresh();

	} else if (msg.action === "setitem") {
		// TODO: construct proper Experiment from msg.value
		experiments[msg.key] = new Experiment(msg.key);
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
	await scan();

	receiver.on("data", (data: any) => {
		net.parseLines(data).forEach((msg: any) => evalMessage(msg));
		vscode.window.showInformationMessage("Updated Explorer");
	});
};

export let scan = async () => {
	vscode.window.showInformationMessage("Scanning repository directory ...");
	await net.rpc("experiment_db", "scan_repository", []);
};

let experimentsFromStruct = (struct: any) => {
	let all: { [key: string]: Experiment } = {};

	// TODO: construct proper Experiment from struct[k]
	Object.keys(struct).forEach(k => all[k] = new Experiment(k));
	return all;
};