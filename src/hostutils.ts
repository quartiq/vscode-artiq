// This is code, that can only be executed in the host context of the extension core
// because of the libraries being imported, hence can not be utilized in webview code
// May not be necessary any longer, as soon the whole codebase becomes typescript anyway
// Not sure though

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export let symbols = async (uri: vscode.Uri | undefined) => {
    return await vscode.commands.executeCommand<vscode.SymbolInformation[]>(
        "vscode.executeDocumentSymbolProvider",
        uri,
    ) ?? [];
};

export let html = (name: string, root: string) => {
    let filePath = path.join(root, "src", "views", `${name}.html`);
    return fs.readFileSync(filePath, "utf-8");
};

export let selectedClass = async () => {
    await vscode.extensions.getExtension("ms-python.python")!.exports.ready;

    let ed = vscode.window.activeTextEditor!;
    if (!ed) { return undefined; }

    let symbol = (await symbols(ed.document.uri))
        .filter(s => s.kind === vscode.SymbolKind.Class)
        .find(s => s.location.range.contains(ed.selection.active));

    return symbol?.name;
};