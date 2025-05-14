// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import * as log from "./views/log";
import * as schedule from "./views/schedule";
import * as experiment from "./views/experiment";
import * as explorer from "./views/explorer";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	await log.init(context);
	await schedule.init(context);
	await experiment.init(context);
	await explorer.init();

	context.subscriptions.push(
		log.view.register(),
		schedule.view.register(),
		experiment.view.register(),
		vscode.commands.registerCommand("artiq.submitExperiment", experiment.submitCurr),
		vscode.commands.registerCommand("artiq.scanRepository", explorer.scan),
		vscode.commands.registerCommand("artiq.openExperiment", explorer.open),
	);

	vscode.window.onDidChangeActiveTextEditor(async editor => {
		await experiment.updateAvailable(editor);
		experiment.updateCurr();
	});

	vscode.window.onDidChangeTextEditorSelection(async ev => {
		await experiment.updateSelected(ev.selections[0]);
		experiment.updateCurr();
	});
};