// This is code, that can only be executed in the host context of the extension core
// because of the libraries being imported, hence can not be utilized in webview code
// May not be necessary any longer, as soon the whole codebase becomes typescript anyway
// Not sure though

// FIXME: drop this; dissolve in utils.ts and others

import * as vscode from "vscode";

export let symbols = async (uri: vscode.Uri | undefined) => {
    return await vscode.commands.executeCommand<vscode.SymbolInformation[]>(
        "vscode.executeDocumentSymbolProvider",
        uri,
    ) ?? [];
};

export let selectedClass: () => Promise<string> = async () => {
    await vscode.extensions.getExtension("ms-python.python")!.exports.ready;

    let ed = vscode.window.activeTextEditor;
    if (!ed) { return ""; }

    let symbol = (await symbols(ed.document.uri))
        .filter(s => s.kind === vscode.SymbolKind.Class)
        .find(s => s.location.range.contains(ed.selection.active));
    // TODO: filter for BaseClassName "EnvExperiment" in the class signature

    return symbol ? symbol.name : "";
};