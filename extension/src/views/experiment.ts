import * as vscode from "vscode";

import * as views from "../views";
import * as net from "../net";
import * as utils from "../utils";

let available: any;
let selected: any;
let curr: any;

export let view: views.ArtiqViewProvider;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("experiment", context.extensionUri, {
        submit: (options: any) => net.submit(curr, options),
    });

    view.init();
    view.post( {active: false} );

    await updateAvailable(vscode.window.activeTextEditor);
    await updateSelected(vscode.window.activeTextEditor?.selection);
    updateCurr();
};

let examineFile = async (editor: vscode.TextEditor | undefined) => {
    if (!editor) { return {}; }

    let resp = await net.rpc("experiment_db", "examine", [
        editor?.document.uri.fsPath,
        false,
    ]);

    if (resp.status === "failed") { return {}; }
    return resp.ret;
};

let findSelected = async (selection: vscode.Selection | undefined) => {
    if (!selection) { return; }
    await vscode.extensions.getExtension("ms-python.python")?.exports.ready;

    return (await utils.symbols(vscode.window.activeTextEditor?.document.uri))
        .filter(s => s.kind === vscode.SymbolKind.Class)
        .find(s => s.location.range.contains(selection.active));
};

export let updateAvailable = async (editor: vscode.TextEditor | undefined) => {
    // TODO: dont examine anytime. cache from repo instead
    available = await examineFile(editor);
};

export let updateSelected = async (selection: vscode.Selection | undefined) => {
    selected = await findSelected(selection);
};

export let updateCurr = () => {
    curr = undefined;
    if (!selected) { return view.post( {active: false} ); }

    curr = available[selected.name];
    if (!curr) { return view.post( {active: false} ); }

    curr.file = vscode.window.activeTextEditor?.document.uri.fsPath;
    curr.class_name = selected.name;
    view.post( {active: true, curr: curr} );
};

export let submitCurr = () => {
    if (!curr) {
        vscode.window.showErrorMessage("No experiment selected.");
        return;
    }

    net.submit(curr);
};
