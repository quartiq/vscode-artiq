import * as vscode from "vscode";
let { flatten, unflatten } = require("flat");

import * as views from "../views";
import * as utils from "../utils";
import * as dbio from "../dbio";
import * as net from "../net";

export let view: views.ArtiqViewProvider;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("experiment", context.extensionUri, {
        submit: net.submitCurr,
        change: (exp: dbio.Experiment) => dbio.update(unflatten(exp)),
    });

    view.init();
    view.post( {action: "init", data: { logLevels: Object.keys(net.logging) }} );
};

export let update = async () => {
    let selectedClass = await utils.selectedClass();
    let exp = await dbio.curr();
    let expFlat = exp && flatten(utils.setMissing(exp, dbio.defaults));
    view.post( {action: "update", data: {selectedClass, expFlat}} );
};

export let examineFile = async () => {
    let path = vscode.window.activeTextEditor!.document.uri.fsPath;
    let resp = await net.rpc("experiment_db", "examine", [path, false]);
    vscode.window.showInformationMessage(`Examined file: ${resp.status}`);

    if (resp.status === "failed") { return {}; }
    let exps = Object.entries(resp.ret).map( ([class_name, exp]: [string, any]) => ({inRepo: false, path, class_name, ...exp}) );
    dbio.updateAll(exps);
};