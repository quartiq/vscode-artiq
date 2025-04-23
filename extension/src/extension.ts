// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as net from "./net";

import * as log from "./views/log";
import * as schedule from "./views/schedule";
import * as experiment from "./views/experiment";
import * as explorer from "./views/explorer";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand("artiq.runExperiment", () => {
		let experiment = vscode.window.activeTextEditor?.document.uri.fsPath;
		if (!experiment) {
			vscode.window.showErrorMessage("No experiment file selected.");
			return;
		}

		net.run(experiment);
	});

	await log.init(context);
	await schedule.init(context);
	await experiment.init(context);
	explorer.init();

	context.subscriptions.push(
		disposable,
		log.view.register(),
		schedule.view.register(),
		experiment.view.register(),
	);

	vscode.window.onDidChangeActiveTextEditor(async editor => {
		await experiment.updateAvailable(editor);
		experiment.updateView();
	});

	vscode.window.onDidChangeTextEditorSelection(async ev => {
		await experiment.updateSelected(ev.selections[0]);
		experiment.updateView();
	});
};