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
    let symbol = (await symbols(ed.document.uri))
        .filter(s => s.kind === vscode.SymbolKind.Class)
        .find(s => s.location.range.contains(ed.selection.active));

    return symbol?.name;
};

export let setMissing = (target: Record<string, any>, source: Record<string, any>): Record<string, any> => {
    let result = target;
    Object.keys(source).forEach(k => {
        result[k] = {...source[k], ...target[k]};
    });

    return result;
};