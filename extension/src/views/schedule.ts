import * as vscode from "vscode";

import * as views from "../views";
import * as syncstruct from "../syncstruct";

export let view: views.ArtiqViewProvider;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("schedule", context.extensionUri);
    view.set("Waiting for connection ...");

    let records = syncstruct.from({
        channel: "schedule",
        onReady: () => view.init(),
        onReceive: () => view.post({records}),
    });
};