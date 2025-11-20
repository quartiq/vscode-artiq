import * as vscode from "vscode";

import * as views from "../views";
import * as net from "../net";
import * as syncstruct from "../syncstruct";

export let view: views.ArtiqViewProvider;

type Runs = Map<number, net.RunInfo>; // FIXME: data type should rather be pyon.Dict than Map
type Struct = { data: Runs };
let runs: Struct = { data: new Map() };

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("schedule", context.extensionUri, {
        rpc: (data: {method: string, args: any[]}) => {
            net.rpc("schedule", data.method, data.args);
        },
    });
    view.set("Waiting for connection ...");

    runs = await syncstruct.from({
        channel: "schedule",
        onReady: () => view.init(),
        // FIXME: payload should rather be pyon, but pyon is not ready
        // for webviews at this stage due to npm deps like ndarray package
        onReceive: (struct: Struct) => view.post({ runEntries: Array.from(struct.data) }),
    });
};