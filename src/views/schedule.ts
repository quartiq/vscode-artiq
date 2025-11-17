import * as vscode from "vscode";

import * as views from "../views";
import * as net from "../net";
import * as syncstruct from "../syncstruct";

export let view: views.ArtiqViewProvider;
let records: { data: Map<number, any> } = { data: new Map() }; // FIXME: create type for "any"

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("schedule", context.extensionUri, {
        rpc: (data: {method: string, args: any[]}) => {
            net.rpc("schedule", data.method, data.args);
        },
    });
    view.set("Waiting for connection ...");

    records = syncstruct.from({
        channel: "schedule",
        onReady: () => view.init(),
        // FIXME: payload should rather be pyon, but pyon is not ready
        // for webviews at this stage due to npm deps like ndarray package
        onReceive: () => view.post({ recordEntries: Array.from(records.data) }),
    });
};