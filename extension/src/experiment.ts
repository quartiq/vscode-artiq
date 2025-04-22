import * as vscode from "vscode";
import * as net from "./net.js";

export let examineFile = async (editor: vscode.TextEditor | undefined) => {
    if (!editor) { return {}; }

    let resp = await net.rpc("experiment_db", "examine", [
        editor?.document.uri.fsPath,
        false,
    ]);

    if (resp.status === "failed") { return {}; }
    return resp.ret;
};

export let selected = async (selection: vscode.Selection | undefined) => {
    if (!selection) { return; }

    let symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>(
        "vscode.executeDocumentSymbolProvider",
        vscode.window.activeTextEditor?.document.uri,
    ) ?? [];

    return symbols
        .filter(s => s.kind === vscode.SymbolKind.Class)
        .find(s => s.location.range.contains(selection.active));
};