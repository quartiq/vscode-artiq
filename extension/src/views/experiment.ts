import * as vscode from "vscode";
import * as net from "../net.js";
import * as views from "../views.js";

let examineFile = async (editor: vscode.TextEditor | undefined) => {
    if (!editor) { return {}; }

    let [resp] = await net.rpc("experiment_db", "examine", [
        editor?.document.uri.fsPath,
        false,
    ]);

    if (resp.status === "failed") { return {}; }
    return resp.ret;
};

let findSelected = async (selection: vscode.Selection | undefined) => {
    if (!selection) { return; }

    await vscode.extensions.getExtension("ms-python.python")?.exports.ready;

    let symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>(
        "vscode.executeDocumentSymbolProvider",
        vscode.window.activeTextEditor?.document.uri,
    ) ?? [];

    return symbols
        .filter(s => s.kind === vscode.SymbolKind.Class)
        .find(s => s.location.range.contains(selection.active));
};

export let updateAvailable = async (editor: vscode.TextEditor | undefined) => {
    available = await examineFile(editor);
};

export let updateSelected = async (selection: vscode.Selection | undefined) => {
    selected = await findSelected(selection);
};

export let updateCurr = () => {
    curr = undefined;
    if (!selected) { return view.reset(); }

    curr = available[selected.name];
    if (!curr) { return view.reset(); }

    curr.file = vscode.window.activeTextEditor?.document.uri.fsPath;
    curr.class_name = selected.name;
    view.update(JSON.stringify(curr));
};

export let submitCurr = () => {
    if (!curr) {
        vscode.window.showErrorMessage("No experiment selected.");
        return;
    }

    net.submit(curr);
};

let available: any;
let selected: any;
let curr: any;
export let view: views.ArtiqViewProvider;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("experiment", context.extensionUri, "Select an experiment in the editor or in the explorer ...");
    view.reset();

    await updateAvailable(vscode.window.activeTextEditor);
    await updateSelected(vscode.window.activeTextEditor?.selection);
    updateCurr();
};