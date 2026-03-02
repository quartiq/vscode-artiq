import * as vscode from "vscode";

import * as run from "../run.js";
import * as views from "../views.js";
import * as net from "../net.js";
import * as syncstruct from "../syncstruct.js";
import * as pyon from "../pyon/pyon.js";

export let view: views.ArtiqViewProvider;

type Runs = pyon.Dict<run.Id, run.SyncInfo>;
type Struct = { data: Runs };

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("schedule", context.extensionUri, {
        rpc: (data: {method: string, rid: number}) => {
            net.rpc("schedule", data.method, [data.rid]);
        },
    });
    view.set("Waiting for connection ...");

    syncstruct.from({
        channel: "schedule",
        onReady: () => view.init(),
        onReceive: (struct: Struct) => view.post(pyon.encode(struct.data)),
    });
};