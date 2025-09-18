import * as vscode from "vscode";

import * as net from "./net";
import * as dbio from "./dbio";


export let submitCurr = async () => {
    let curr = await dbio.curr();
    curr ? net.submit(curr) : vscode.window.showErrorMessage("Submit failed: No experiment selected.");
};

export let examineFile = async () => {
    let path = vscode.window.activeTextEditor!.document.uri.fsPath;
    let resp = await net.rpc("experiment_db", "examine", [path, false]);
    vscode.window.showInformationMessage(`Examined file: ${resp.status}`);

    if (resp.status === "failed") { return {}; }
    let exps = Object.entries(resp.ret).map( ([class_name, exp]: [string, any]) => ({inRepo: false, path, class_name, ...exp}) );
    dbio.updateAll(exps);
};