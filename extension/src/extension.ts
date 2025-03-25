// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { WebSocket } from "ws";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const provider = new ArtiqViewProvider(context.extensionUri);
	const terminal = vscode.window.createTerminal("ARTIQ");

	// TODO: Where does flake.nix live?
	terminal.sendText("nix shell ../flake.nix");

	const disposable = vscode.commands.registerCommand("extension.artiqRunExperiment", () => {
		let filepath = vscode.window.activeTextEditor?.document.uri.fsPath;
		if (!filepath) {
			vscode.window.showErrorMessage("No experiment file selected.");
			return;
		}

		// TODO test for errors in stderr;
		// TODO use own terminal? test if terminal exists
		// see: https://github.com/microsoft/vscode-extension-samples/blob/main/terminal-sample
		terminal.sendText(`artiq_client submit ${filepath}`);
		vscode.window.showInformationMessage(`Running experiment: ${filepath}`);
	});

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ArtiqViewProvider.viewType, provider),
		disposable,
	);
}

class ArtiqViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = "log";

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		_context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		let html = "[level, source, time, message]<br>";
		webviewView.webview.html = html;

		const host = vscode.workspace.getConfiguration("forwarding").get("host");
		const ws = new WebSocket("ws://" + host);
		ws.addEventListener("message", ev => {
			html += `${ev.data}<br>`;
			webviewView.webview.html = html;
		});
	}
}
