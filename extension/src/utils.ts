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

export let splitOnLast = (str: string, delimiter: string): string[] => {
    let i = str.lastIndexOf(delimiter);
    if (i === -1) { return [str]; }
    return [str.slice(0, i), str.slice(i + delimiter.length)];
};

let splitArrOnLast = (arr: any[]): [any[], any] => [arr.slice(0, -1), arr[arr.length - 1]];

export let setPath = (target: Record<string, any>, keys: string[], value: any) => {
    let [approach, access] = splitArrOnLast(keys);
    let sub = approach.reduce((acc, key) => acc[key], target);
    sub[access] = value;
};