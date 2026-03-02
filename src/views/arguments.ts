import * as vscode from "vscode";

import * as views from "../views.js";
import * as experiment from "../experiment.js";
import * as argument from "../argument.js";
import * as run from "../run.js";

export let view: views.ArtiqViewProvider;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("arguments", context.extensionUri, {
        submit: run.submitCurr,
        change: async (data: argument.RowInfo<argument.Procdesc>) => {
            let exp = await experiment.curr();
            if (!exp) { return; }

            exp.arginfo[data.name] = data.arg;
            experiment.updateDb(exp);
        },
    });
    view.init();
};

export let update = async () => {
    let exp = await experiment.curr();
    view.post({
        action: "update",
        data: Object.entries(exp?.arginfo) as argument.RowInfo<argument.Procdesc>[],
    });
};