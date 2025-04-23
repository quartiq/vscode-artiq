import * as vscode from "vscode";
import * as mutex from "./mutex";

export class ArtiqViewProvider implements vscode.WebviewViewProvider {

	private _view?: vscode.WebviewView;
	private ready: mutex.Lock;
	private html: string;

	constructor(
		private readonly _viewType: string,
		private readonly _extensionUri: vscode.Uri,
		private readonly _initText: string,
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
	}

	public register(): vscode.Disposable {
		return vscode.window.registerWebviewViewProvider(this._viewType, this);
	} 

	public async update(html: string) {
		await this.ready.locked;

		this.html = html;
		this._view!.webview.html = this.html;
	}

	public async append(html: string) {
		await this.ready.locked;

		this.html += html;
		this._view!.webview.html = this.html;
	}

	public async reset() {
		await this.ready.locked;

		this.html = this._initText;
		this._view!.webview.html = this.html;
	}
}