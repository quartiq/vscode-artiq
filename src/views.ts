import * as vscode from "vscode";

import * as mutex from "./mutex.js";
import * as hostutils from "./hostutils.js";

export class ArtiqViewProvider implements vscode.WebviewViewProvider {

	private _view?: vscode.WebviewView;
	private ready: mutex.Lock;
	private html: string;

	constructor(
		private readonly _viewType: string,
		private readonly _extensionUri: vscode.Uri,
		private readonly _actions?: Record<string, ((data: any) => void)>,
	) {
		this.ready = mutex.lock();
		this.html = "";
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		_context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;
		this.ready.unlock();

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.onDidReceiveMessage(msg => this._actions?.[msg.action](msg.data));
	}

	public register(): vscode.Disposable {
		return vscode.window.registerWebviewViewProvider(this._viewType, this, {
			// keep the webview alive, even if it is not visible
			webviewOptions: { retainContextWhenHidden: true },
		});
	}

	public async set(text: string) {
		await this.ready.locked;

		this.html = text;
		this._view!.webview.html = this.html;
	}

	public async init() {
		await this.ready.locked;

		let tabulatorScriptUri = this._view!.webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "node_modules", "tabulator-tables", "dist", "js", "tabulator.min.js")
		);

		let tabulatorStylesUri = this._view!.webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "node_modules", "tabulator-tables", "dist", "css", "tabulator.min.css")
		);

		let customStylesUri = this._view!.webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src", "views", "main.css")
		);

		let sharedUri = this._view!.webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "out_webview")
		);

		// TODO: make all webviews typescript based, no more html files!
		this.html = hostutils.html(this._viewType, this._extensionUri.fsPath)
			.replaceAll("{TABULATOR_SCRIPT_URI}", tabulatorScriptUri.toString())
			.replaceAll("{TABULATOR_STYLES_URI}", tabulatorStylesUri.toString())
			.replaceAll("{CUSTOM_STYLES_URI}", customStylesUri.toString())
			.replaceAll("{SHARED_URI}", sharedUri.toString());

		this._view!.webview.html = this.html;
	}

	public async post(msg: any) {
		await this.ready.locked;

		this._view!.webview.postMessage(msg);
	}
}