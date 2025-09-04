import * as vscode from "vscode";

import * as views from "../views";
import * as dbio from "../dbio";
import * as net from "../net";

export let view: views.ArtiqViewProvider;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("arguments", context.extensionUri, {
        submit: net.submitCurr,
        change: async (data: {name: string, arg: dbio.Argument}) => {
            let exp = await dbio.curr();
            if (!exp) { return; }

            exp.arginfo[data.name] = data.arg;
            dbio.update(exp);
        },
    });
    view.init();
};

export let update = async () => {
    let exp = await dbio.curr();
    view.post( {action: "update", data: {arginfo: exp?.arginfo}} );
};