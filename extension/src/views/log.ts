import * as vscode from "vscode";
import * as views from "../views.js";
import * as net from "../net.js";

export let view: views.ArtiqViewProvider;
let receiver;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("log", context.extensionUri, "Waiting for connection ...");
    view.reset();

    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L347-L348
    receiver = await net.receiver(1067, "broadcast", "log");
    receiver.on("ready", () => view.update("[level, source, time, message]<br>"));
    receiver.on("data", (line: string) => view.append(`${line}<br>`));
};