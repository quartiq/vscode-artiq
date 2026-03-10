import * as vscode from "vscode";
import * as path from "path";

import * as mutex from "./mutex.js";

export class ArtiqViewProvider implements vscode.WebviewViewProvider {

	private view?: vscode.WebviewView;
	private ready: mutex.Lock;
	private html: string;

	constructor(
		private readonly viewType: string,
		private readonly context: vscode.ExtensionContext,
		private readonly actions?: Record<string, ((data: any) => void)>,
	) {
		this.ready = mutex.lock();
		this.html = "";
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		_context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this.view = webviewView;
		this.ready.unlock();

		webviewView.webview.options = {
			enableScripts: true, // allow scripts in webviews
			localResourceRoots: [
				vscode.Uri.file(this.context.extensionPath),
			],
		};

		webviewView.webview.onDidReceiveMessage(msg => this.actions?.[msg.action](msg.data));
	}

	public register(): vscode.Disposable {
		return vscode.window.registerWebviewViewProvider(this.viewType, this, {
			// keep webviews alive, even if it is not visible
			webviewOptions: { retainContextWhenHidden: true },
		});
	}

	public async set(text: string) {
		await this.ready.locked;

		this.html = text;
		this.view!.webview.html = this.html;
	}

	public async init() {
		await this.ready.locked;

		let stylesTabulatorUri = this.view!.webview.asWebviewUri(
			vscode.Uri.joinPath(this.context.extensionUri, "node_modules", "tabulator-tables", "dist", "css", "tabulator.min.css")
		);

		let stylesMainUri = this.view!.webview.asWebviewUri(
			vscode.Uri.joinPath(this.context.extensionUri, "src", "webviews", "main.css")
		);

		let scriptUri = this.view!.webview.asWebviewUri(
			// FIXME: need to do it like this, because Codium may get the URI scheme wrong otherwise
			vscode.Uri.file(
				path.join(this.context.extensionPath, "out", "webviews", `${this.viewType}.js`)
			)
		);

		this.html = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${ stylesTabulatorUri }" rel="stylesheet">
				<link href="${ stylesMainUri }" rel="stylesheet">
			</head>

			<body>
				<script type="module" src="${ scriptUri }"></script>
			</body>

			</html>
		`;

		this.view!.webview.html = this.html;
	}

	public async post(msg: any) {
		await this.ready.locked;

		this.view!.webview.postMessage(msg);
	}
}