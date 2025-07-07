import * as vscode from "vscode";

import * as views from "../views";
import * as net from "../net";

export let view: views.ArtiqViewProvider;
let receiver;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("log", context.extensionUri);
    view.set("Waiting for connection ...");

    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L347-L348
    receiver = await net.receiver(1067, "broadcast", "log");
    receiver.on("ready", () => view.init());
    receiver.on("data", (data: net.Bytes) => view.post(net.parseLines(data)));
};