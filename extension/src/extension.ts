// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import * as dbio from "./dbio";

import * as viewLog from "./views/log";
import * as viewSchedule from "./views/schedule";
import * as viewExperiment from "./views/experiment";
import * as viewExplorer from "./views/explorer";
import * as viewDatasets from "./views/datasets";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	dbio.init(context);

	await viewLog.init(context);
	await viewSchedule.init(context);
	await viewExperiment.init(context);
	await viewExplorer.init();
	await viewDatasets.init();

	context.subscriptions.push(
		viewLog.view.register(),
		viewSchedule.view.register(),
		viewExperiment.view.register(),
		viewExplorer.view,
		viewDatasets.view,

		vscode.commands.registerCommand("artiq.submitExperiment", viewExperiment.submit),
		vscode.commands.registerCommand("artiq.examineFile", viewExperiment.examineFile),
		vscode.commands.registerCommand("artiq.scanRepository", viewExplorer.scan),
		vscode.commands.registerCommand("artiq.openExperiment", viewExplorer.open),
		vscode.commands.registerCommand("artiq.moveDataset", viewDatasets.move),
	);

	vscode.window.onDidChangeTextEditorSelection(async () => {
		viewExperiment.update();
		viewExplorer.update();
	});

	dbio.onUpdate(() => {
		viewExperiment.update();
		viewExplorer.update();
	});
};