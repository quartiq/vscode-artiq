import * as vscode from "vscode";

import * as webview from "../webview.js";
import * as net from "../net.js";

export let view: webview.Provider;

export let init = async (context: vscode.ExtensionContext) => {
    view = new webview.Provider("log", context);
    view.init();

    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L347-L348
    let receiver = await net.receiver(1067, "broadcast", "log");
    // TODO: use pyon for messaging between core and webview in ALL webviews
    receiver.on("data", (data: net.Bytes) => view.post(net.parseLines(data)));
};