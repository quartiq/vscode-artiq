import * as vscode from "vscode";
import * as mutex from "./mutex.js";
import * as coreutils from "./coreutils.js";
export class ArtiqViewProvider {
    _viewType;
    _extensionUri;
    _actions;
    _view;
    ready;
    html;
    constructor(_viewType, _extensionUri, _actions) {
        this._viewType = _viewType;
        this._extensionUri = _extensionUri;
        this._actions = _actions;
        this.ready = mutex.lock();
        this.html = "";
    }
    resolveWebviewView(webviewView, _context, _token) {
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
    register() {
        return vscode.window.registerWebviewViewProvider(this._viewType, this, {
            // keep the webview alive, even if it is not visible
            webviewOptions: { retainContextWhenHidden: true },
        });
    }
    async set(text) {
        await this.ready.locked;
        this.html = text;
        this._view.webview.html = this.html;
    }
    async init() {
        await this.ready.locked;
        let tabulatorScriptUri = this._view.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "node_modules", "tabulator-tables", "dist", "js", "tabulator.min.js"));
        let tabulatorStylesUri = this._view.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "node_modules", "tabulator-tables", "dist", "css", "tabulator.min.css"));
        let customStylesUri = this._view.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "src", "views", "main.css"));
        let scriptUri = this._view.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "webviews", this._viewType, ".js"));
        // TODO: make all webviews typescript based, no more html files!
        this.html = coreutils.html(this._viewType, this._extensionUri.fsPath)
            .replaceAll("{TABULATOR_SCRIPT_URI}", tabulatorScriptUri.toString())
            .replaceAll("{TABULATOR_STYLES_URI}", tabulatorStylesUri.toString())
            .replaceAll("{CUSTOM_STYLES_URI}", customStylesUri.toString())
            .replaceAll("{SCRIPT_URI}", scriptUri.toString());
        this._view.webview.html = this.html;
    }
    async post(msg) {
        await this.ready.locked;
        this._view.webview.postMessage(msg);
    }
}
//# sourceMappingURL=views.js.map