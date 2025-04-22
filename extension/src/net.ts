import * as vscode from "vscode";
let net = require("net");
let { once } = require("events");

import * as pyon from "./pyon";

const host = vscode.workspace.getConfiguration("artiq").get("host");

let receiver = (port: Number, banner: string, target: string) => {
    let client = new net.Socket();

    client.connect(port, host, () => {
        client.write("ARTIQ " + banner + "\n");
        client.write(target + "\n");
    });

    client.on("connectionAttemptFailed", () => vscode.window.showErrorMessage("Connection error. Is ARTIQ server running?"));
    return client;
};

// see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L347-L348
export let receiverLog = () => receiver(1067, "broadcast", "log");

// see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L336
export let receiverSchedule = () => receiver(3250, "sync_struct", "schedule");

export let rpc = async (target: string, method: string, args: any[], debug?: string) => {
    let client = new net.Socket();
    client.connect(3251, host);

    await once(client, "connect");

    client.write("ARTIQ pc_rpc\n");
    let targets = await once(client, "data");
    if (debug === "targets") { return targets; }

    client.write(target + "\n");
    let methods = await once(client, "data");
    if (debug === "methods") { return methods; }

    client.write(pyon.encode({
        action: "call",
        name: method,
        args: args,
        kwargs: {},
    }) + "\n");

    let response = await once(client, "data");
    return pyon.decode(response.toString());
};

export let run = (filepath: string) => {
    const WARNING = 30;

    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L381
    // see: https://github.com/m-labs/artiq/blob/master/artiq/master/scheduler.py#L436
    rpc("schedule", "submit", [
        "main", // pipeline_name
        { // expid
            file: filepath,
            log_level: WARNING,
            class_name: null,
            arguments: {},
        },
    ]);

    vscode.window.showInformationMessage(`Running experiment: ${filepath}`);
};