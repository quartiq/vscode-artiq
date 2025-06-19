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

let matchRepoExps = (root: string, editor: vscode.TextEditor | undefined) => {
    let matched = Object.entries(cached.repoExps)
        .filter(([k, v]) => path.posix.join(root, v.file) === editor?.document.uri.fsPath);
    return matched.map(([k, v]) => ({name: k, ...v}));
};

let matchExamExps = (editor: vscode.TextEditor | undefined) => {
    let matched = Object.entries(cached.examExps)
        .filter(([k, v]) => v.path === editor?.document.uri.fsPath);
    return matched.map(([k, v]) => v);
};

export let updateAvailable = async (editor: vscode.TextEditor | undefined) => {
    if (!editor) { return; }

    let repoRoot = await cached.repoRoot;
    await cached.repoExpsReady.locked;

    if (editor.document.uri.fsPath.startsWith(repoRoot)) {
        availableExps = matchRepoExps(repoRoot, editor);
        return;
    }

    availableExps = matchExamExps(editor);
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

export let updateCurr = async () => {
    cached.setCurr(availableExps.find(exp => exp.class_name === selectedClass));
    let isRepoFile = vscode.window.activeTextEditor?.document.uri.fsPath.startsWith(await cached.repoRoot);
    view.post( {isRepoFile, selectedClass, curr: cached.curr} );
};

export let submitCurr = () => {
    if (!cached.curr) {
        vscode.window.showErrorMessage("No experiment selected.");
        return;
    }

    net.submit(cached.curr);
};

export let examineFile = async () => {
    let path = vscode.window.activeTextEditor?.document.uri.fsPath;
    let resp = await net.rpc("experiment_db", "examine", [path, false]);
    vscode.window.showInformationMessage(`Examined file: ${resp.status}`);

    if (resp.status === "failed") { return {}; }
    cached.setExamExps(Object.entries(resp.ret), path!);
};