import * as vscode from "vscode";

class Experiment extends vscode.TreeItem {}

class ExplorerProvider implements vscode.TreeDataProvider<Experiment> {
	constructor(private file: string | undefined) {}

	getTreeItem(element: Experiment): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(element?: Experiment | undefined): Thenable<Experiment[]> {
		if (!this.file) {
			vscode.window.showInformationMessage("No active file in text editor");
			return Promise.resolve([]);
		}

		if (element) {
			return Promise.resolve([]);
		}

		return Promise.resolve([]);
	}
}

export let init = () => {
    let file = vscode.window.activeTextEditor?.document.uri.fsPath;
    let explorerProvider = new ExplorerProvider(file);
    vscode.window.registerTreeDataProvider("explorer", explorerProvider);
};