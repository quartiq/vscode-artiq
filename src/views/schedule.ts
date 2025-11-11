import * as vscode from "vscode";

import * as views from "../views";
import * as net from "../net";
import * as syncstruct from "../syncstruct";

export let view: views.ArtiqViewProvider;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("schedule", context.extensionUri, {
        rpc: (data: {method: string, args: any[]}) => {
            net.rpc("schedule", data.method, data.args);
        },
    });
    view.set("Waiting for connection ...");

    // TODO: sometimes on UI startup artiq_master wants to update
    // a particular element in records, but records is empty initially
    // check for that bug
    let records = syncstruct.from({
        channel: "schedule",
        onReady: () => view.init(),
        onReceive: (mod) => { view.post({ records }); console.log("RECORDS", records instanceof Map); },
    });
};