import * as vscode from "vscode";

import * as views from "../views.js";
import * as net from "../net.js";

export let view: views.ArtiqViewProvider;
let receiver;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("log", context.extensionUri);
    view.set("Waiting for connection ...");

    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L347-L348
    receiver = await net.receiver(1067, "broadcast", "log");
    receiver.on("ready", () => view.init());
    // TODO: use pyon for messaging between core and webview in ALL webviews
    receiver.on("data", (data: net.Bytes) => view.post(net.parseLines(data)));
};