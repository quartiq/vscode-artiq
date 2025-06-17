import * as vscode from "vscode";
import * as path from "path";

import * as views from "../views";
import * as net from "../net";
import * as utils from "../utils";
import * as cached from "../cached";

let availableExps: any[] = [];
let selectedClass: any;

export let view: views.ArtiqViewProvider;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("experiment", context.extensionUri, {
        submit: (options: any) => net.submit(cached.curr, options),
    });

    view.init();
    view.post( {active: false} );
};

let examineFile = async (path: string) => {
    let resp = await net.rpc("experiment_db", "examine", [path, false]);

    if (resp.status === "failed") { return {}; }
    return resp.ret;
};

export let updateAvailable = async (editor: vscode.TextEditor | undefined) => {
    if (!editor) { return; }

    let root = await cached.repoRoot;
    await cached.repoExpsReady.locked;

    let entries = Object.entries(cached.repoExps)
        .filter(([k, v]) => path.posix.join(root, v.file) === editor.document.uri.fsPath);
    availableExps = entries.map(([k, v]) => ({name: k, ...v}));

    if (entries.length > 0) { return; } // examine file only if file is not part of most recent repo scan
    entries = Object.entries(await examineFile(editor.document.uri.fsPath));
    availableExps = entries.map(([k, v]) => ({class_name: k, ...v}));
    // FIXME: what experiment_db/examine and sync_struct/explist return different maps. why though?
};

let findSelected = async (selection: vscode.Selection | undefined) => {
    if (!selection) { return; }
    await vscode.extensions.getExtension("ms-python.python")?.exports.ready;

    return (await utils.symbols(vscode.window.activeTextEditor?.document.uri))
        .filter(s => s.kind === vscode.SymbolKind.Class)
        .find(s => s.location.range.contains(selection.active));
};

export let updateSelected = async (selection: vscode.Selection | undefined) => {
    selectedClass = (await findSelected(selection))?.name;
};

export let updateCurr = () => {
    let curr = availableExps.find(exp => exp.class_name === selectedClass);
    cached.setCurr(curr);

    if (!cached.curr) { return view.post( {active: false} ); }
    view.post( {active: true, curr: cached.curr} );
};

export let submitCurr = () => {
    if (!cached.curr) {
        vscode.window.showErrorMessage("No experiment selected.");
        return;
    }

    net.submit(cached.curr);
};
