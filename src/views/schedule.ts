import * as vscode from "vscode";

import * as run from "../run.js";
import * as views from "../views.js";
import * as net from "../net.js";
import * as syncstruct from "../syncstruct.js";

export let view: views.ArtiqViewProvider;

type Runs = Map<number, run.SyncInfo>; // FIXME: data type should rather be pyon.Dict than Map
type Struct = { data: Runs };
let runs: Struct = { data: new Map() };

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("schedule", context.extensionUri, {
        rpc: (data: {method: string, rid: number}) => {
            net.rpc("schedule", data.method, [data.rid]);
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