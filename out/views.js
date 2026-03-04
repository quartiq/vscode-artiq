import * as vscode from "vscode";
import * as path from "path";
import * as mutex from "./mutex.js";
import * as coreutils from "./coreutils.js";
export class ArtiqViewProvider {
    viewType;
    context;
    actions;
    view;
    ready;
    html;
    constructor(viewType, context, actions) {
        this.viewType = viewType;
        this.context = context;
        this.actions = actions;
        this.ready = mutex.lock();
        this.html = "";
    }
    resolveWebviewView(webviewView, _context, _token) {
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
    register() {
        return vscode.window.registerWebviewViewProvider(this.viewType, this, {
            // keep webviews alive, even if it is not visible
            webviewOptions: { retainContextWhenHidden: true },
        });
    }
    async set(text) {
        await this.ready.locked;
        this.html = text;
        this.view.webview.html = this.html;
    }
    async init() {
        await this.ready.locked;
        let tabulatorScriptUri = this.view.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "node_modules", "tabulator-tables", "dist", "js", "tabulator.min.js"));
        let tabulatorStylesUri = this.view.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "node_modules", "tabulator-tables", "dist", "css", "tabulator.min.css"));
        let customStylesUri = this.view.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src", "views", "main.css"));
        let scriptUri = this.view.webview.asWebviewUri(
        // FIXME: need to do it like this, because Codium may get the URI scheme wrong otherwise
        vscode.Uri.file(path.join(this.context.extensionPath, "out", "webviews", `${this.viewType}.js`)));
        // TODO: make all webviews typescript based, no more html files!
        this.html = coreutils.html(this.viewType, this.context.extensionUri.fsPath)
            .replaceAll("{TABULATOR_SCRIPT_URI}", tabulatorScriptUri.toString())
            .replaceAll("{TABULATOR_STYLES_URI}", tabulatorStylesUri.toString())
            .replaceAll("{CUSTOM_STYLES_URI}", customStylesUri.toString())
            .replaceAll("{SCRIPT_URI}", scriptUri.toString());
        this.view.webview.html = this.html;
    }
    async post(msg) {
        await this.ready.locked;
        this.view.webview.postMessage(msg);
    }
}
//# sourceMappingURL=views.js.map