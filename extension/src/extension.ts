// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WebSocket } from 'ws';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const provider = new ArtiqViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ArtiqViewProvider.viewType, provider));
}

class ArtiqViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'log';

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

		let html = "";
		webviewView.webview.html = html;

		const ws = new WebSocket("ws://localhost:8001");
		ws.addEventListener("message", ev => {
			html += `<p>${ev.data}</p>`;
			webviewView.webview.html = html;
		});
	}
}