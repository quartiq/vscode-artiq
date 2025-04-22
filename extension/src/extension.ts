// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as net from "./net";
import * as views from "./views";
import * as experiment from "./experiment";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	let logReceiver = await net.receiverLog();
	let scheduleReceiver = await net.receiverSchedule();

	const disposable = vscode.commands.registerCommand("artiq.runExperiment", () => {
		let experiment = vscode.window.activeTextEditor?.document.uri.fsPath;
		if (!experiment) {
			vscode.window.showErrorMessage("No experiment file selected.");
			return;
		}

		net.run(experiment);
	});

	let file = vscode.window.activeTextEditor?.document.uri.fsPath;
	let ExplorerProvider = new views.ExplorerProvider(file);
	vscode.window.registerTreeDataProvider("explorer", ExplorerProvider);

	let logView = new views.ArtiqViewProvider("log", context.extensionUri, "Waiting for connection ...");
	let scheduleView = new views.ArtiqViewProvider("schedule", context.extensionUri, "Waiting for connection ...");
	let experimentView = new views.ArtiqViewProvider("experiment", context.extensionUri, "Select an experiment in the editor or in the explorer ...");

	context.subscriptions.push(
		disposable,
		logView.register(),
		scheduleView.register(),
		experimentView.register(),
	);

	logView.reset();
	logReceiver.on("ready", () => logView.update("[level, source, time, message]<br>"));
	logReceiver.on("data", (line: string) => logView.append(`${line}<br>`));

	logView.reset();
	scheduleReceiver.on("ready", () => scheduleView.update("[rid, pipeline, status, prio, due date, revision, file, class name]<br>"));
	scheduleReceiver.on("data", (line: string) => scheduleView.append(`${line}<br>`));

	experimentView.reset();

	let available = await experiment.examineFile(vscode.window.activeTextEditor);
	let selected = await experiment.selected(vscode.window.activeTextEditor?.selection);

	vscode.window.onDidChangeActiveTextEditor(async editor => {
		available = await experiment.examineFile(editor);
		if (!selected) { return experimentView.reset(); }

		let curr = available[selected.name];
		if (!curr) { return experimentView.reset(); }

		experimentView.update(JSON.stringify(curr));
	});

	vscode.window.onDidChangeTextEditorSelection(async ev => {
		selected = await experiment.selected(ev.selections[0]);
		if (!selected) { return experimentView.reset(); }

		let curr = available[selected.name];
		if (!curr) { return experimentView.reset(); }

		experimentView.update(JSON.stringify(curr));
	});
};