import * as vscode from "vscode";
import * as views from "../views";
import * as net from "../net";

export let view: views.ArtiqViewProvider;
let receiver;

export let init = async (context: vscode.ExtensionContext) => {
    view = new views.ArtiqViewProvider("schedule", context.extensionUri, "Waiting for connection ...");
    view.reset();

    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L336
    receiver = await net.receiver(3250, "sync_struct", "schedule");
    receiver.on("ready", () => view.update("[rid, pipeline, status, prio, due date, revision, file, class name]<br>"));
    receiver.on("data", (line: string) => view.append(`${line}<br>`));
};