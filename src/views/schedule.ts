import * as vscode from "vscode";

import * as run from "../run.js";
import * as views from "../webviews.js";
import * as net from "../net.js";
import * as syncstruct from "../syncstruct.js";
import * as pyon from "../pyon/pyon.js";

export let view: views.ArtiqViewProvider;

export type Runs = pyon.Dict<run.Id, run.SyncInfo>;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("schedule", context, {
        rpc: (data: {method: string, rid: number}) => {
            net.rpc("schedule", data.method, [data.rid]);
        },
    });
    view.set("Waiting for connection ...");

    syncstruct.from({
        channel: "schedule",
        onReady: () => view.init(),
        onReceive: (store: syncstruct.Store) => view.post(pyon.encode(store.struct as Runs)),
    });
};