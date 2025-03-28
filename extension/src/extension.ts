// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const provider = new ArtiqViewProvider(context.extensionUri);
	const terminal = vscode.window.createTerminal("ARTIQ");

	// TODO: Run via sipyco TCP interface
	terminal.sendText("nix shell ../flake.nix");

	const disposable = vscode.commands.registerCommand("artiq.runExperiment", () => {
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

		let net = require("net");
		let client = new net.Socket();
		let host = vscode.workspace.getConfiguration("artiq").get("host");

		// see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L347-L348
		client.connect(1067, host, () => {
			client.write("ARTIQ broadcast\n");
			client.write("log\n");
		});

		client.on("data", (line: string) => {
			html += `${line}<br>`;
			webviewView.webview.html = html;
		});
	}
}
