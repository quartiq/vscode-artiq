// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as net from "./net";
import * as views from "./views";

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

	let logView = new views.ArtiqViewProvider("log", context.extensionUri);
	let scheduleView = new views.ArtiqViewProvider("schedule", context.extensionUri);

	context.subscriptions.push(
		disposable,
		logView.register(),
		scheduleView.register(),
	);

	logView.update("Waiting for connection ...");
	logReceiver.on("ready", () => logView.update("[level, source, time, message]<br>"));
	logReceiver.on("data", (line: string) => logView.append(`${line}<br>`));

	scheduleView.update("Waiting for connection ...");
	scheduleReceiver.on("ready", () => scheduleView.update("[rid, pipeline, status, prio, due date, revision, file, class name]<br>"));
	scheduleReceiver.on("data", (line: string) => scheduleView.append(`${line}<br>`));
}