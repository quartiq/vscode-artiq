import * as vscode from "vscode";

import * as views from "../views.js";
import * as experiment from "../experiment.js";
import * as hostutils from "../coreutils.js";

export let view: views.ArtiqViewProvider;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("experiment", context.extensionUri, {
        change: async <K extends keyof experiment.DbInfo>(data: {key: K, value: experiment.DbInfo[K]}) => {
            let exp = await experiment.curr();
            if (!exp) { return; }

            exp[data.key] = data.value;
            experiment.updateDb(exp);
        },
    });

    view.init();
};

export let update = async () => {
    let selectedClass = await hostutils.selectedClass();
    let exp = await experiment.curr();
    let inRepo = exp ? experiment.inRepo(exp) : false;
    view.post( {action: "update", data: {selectedClass, inRepo, exp}} );
};