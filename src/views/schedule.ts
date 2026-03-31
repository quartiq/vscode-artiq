import * as vscode from "vscode";
import * as pyon from "sipyco/pyon";
import * as sync_struct from "sipyco/sync_struct";

import * as run from "../run.js";
import * as webview from "../webview.js";
import * as net from "../net.js";

export let view: webview.Provider;

export type Runs = pyon.Dict<run.Id, run.SyncInfo>;

export let init = async (context: vscode.ExtensionContext) => {
    view = new webview.Provider("schedule", context, {
        rpc: (data: {method: string, rid: number}) => {
            net.rpc("schedule", data.method, [data.rid]);
        },
    });
    view.init();

    sync_struct.from({
        masterHostname: vscode.workspace.getConfiguration("artiq").get("host")!,
        notifierName: "schedule",
        onReceive: (store: sync_struct.Store) => view.post(pyon.encode(store.struct as Runs)),
        // TODO: cant see this error
        onError: err => vscode.window.showErrorMessage("Connection error. Is ARTIQ server running?", err), // FIXME: handle this error globally?
    });
};