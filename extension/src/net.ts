import * as vscode from "vscode";
let net = require("net");
let { once } = require("events");

import * as pyon from "./pyon";

const host = vscode.workspace.getConfiguration("artiq").get("host");

export let receiver = (port: Number, banner: string, target: string) => {
    let client = new net.Socket();

    client.connect(port, host, () => {
        client.write("ARTIQ " + banner + "\n");
        client.write(target + "\n");
    });

    client.on("connectionAttemptFailed", () => vscode.window.showErrorMessage("Connection error. Is ARTIQ server running?"));
    return client;
};

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

    return parseLine(await once(client, "data"));
};

let parseLine = (bytes: any) => pyon.decode(bytes.toString());

export let parseLines = (bytes: any) => bytes.toString().trim().split("\n")
    .map((s: string) => pyon.decode(s));

export let submit = (exp: any) => {
    const WARNING = 30;

    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L381
    // see: https://github.com/m-labs/artiq/blob/master/artiq/master/scheduler.py#L436
    rpc("schedule", "submit", [
        "main", // pipeline_name
        { // expid
            file: exp.file,
            log_level: WARNING,
            class_name: exp.class_name,
            arguments: {},
        },
    ]);

    vscode.window.showInformationMessage(`Submitted experiment: ${exp.name}`);
};