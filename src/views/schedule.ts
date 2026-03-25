import * as vscode from "vscode";
import * as pyon from "sipyco/pyon";

import * as run from "../run.js";
import * as webview from "../webview.js";
import * as net from "../net.js";
import * as syncstruct from "../syncstruct.js";

export let view: webview.Provider;

export type Runs = pyon.Dict<run.Id, run.SyncInfo>;

export let init = async (context: vscode.ExtensionContext) => {
    view = new webview.Provider("schedule", context, {
        rpc: (data: {method: string, rid: number}) => {
            net.rpc("schedule", data.method, [data.rid]);
        },
    });
    view.set("Waiting for connection ...");

    syncstruct.from({
        channel: "schedule",
        onReceive: (store: syncstruct.Store) => view.post(pyon.encode(store.struct as Runs)),
    });
};