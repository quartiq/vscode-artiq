import * as vscode from "vscode";

import * as webview from "../webview.js";
import * as net from "../net.js";

export let view: webview.Provider;
let receiver;

export let init = async (context: vscode.ExtensionContext) => {
    view = new webview.Provider("log", context);
    view.set("Waiting for connection ...");

    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L347-L348
    receiver = await net.receiver(1067, "broadcast", "log");
    receiver.on("ready", () => view.init());
    // TODO: use pyon for messaging between core and webview in ALL webviews
    receiver.on("data", (data: net.Bytes) => view.post(net.parseLines(data)));
};