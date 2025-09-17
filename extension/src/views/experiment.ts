import * as vscode from "vscode";

import * as views from "../views";
import * as dbio from "../dbio";
import * as utils from "../utils";
import * as hostutils from "../hostutils";

export let view: views.ArtiqViewProvider;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("experiment", context.extensionUri, {
        change: async (data: {path: string[], value: any}) => {
            let exp = await dbio.curr();
            if (!exp) { return; }

            utils.setByPath(exp, data.path, data.value);
            dbio.update(exp);
        },
    });

    view.init();
};

export let update = async () => {
    let selectedClass = await hostutils.selectedClass();
    let exp = await dbio.curr();
    view.post( {action: "update", data: {selectedClass, exp}} );
};