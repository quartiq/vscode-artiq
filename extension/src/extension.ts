// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as net from "./net";
import * as views from "./views";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let r_log = net.r_log();
	let r_schedule = net.r_schedule();
	let w_schedule = net.w_schedule();

	const disposable = vscode.commands.registerCommand("artiq.runExperiment", () => {
		let experiment = vscode.window.activeTextEditor?.document.uri.fsPath;
		if (!experiment) {
			vscode.window.showErrorMessage("No experiment file selected.");
			return;
		}

		net.run(experiment, w_schedule);
	});

	let logView = new views.ArtiqViewProvider("log", context.extensionUri);
	let scheduleView = new views.ArtiqViewProvider("schedule", context.extensionUri);

	context.subscriptions.push(
		disposable,
		logView.register(),
		scheduleView.register(),
	);

	logView.update("Waiting for connection ...");
	r_log.on("ready", () => logView.update("[level, source, time, message]<br>"));
	r_log.on("data", (line: string) => logView.append(`${line}<br>`));

	scheduleView.update("Waiting for connection ...");
	r_schedule.on("ready", () => scheduleView.update("[rid, pipeline, status, prio, due date, revision, file, class name]<br>"));
	r_schedule.on("data", (line: string) => scheduleView.append(`${line}<br>`));
}