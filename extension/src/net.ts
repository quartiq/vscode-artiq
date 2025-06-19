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

let logging: { [name: string]: Number } = {
    // see: https://docs.python.org/3/library/logging.html#logging-levels
    NOTSET: 0,
    DEBUG: 10,
    INFO: 20,
    WARNING: 30,
    ERROR: 40,
    CRITICAL: 50,
};

export let submit = (exp: any, options?: any) => {
    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L381
    // see: https://github.com/m-labs/artiq/blob/master/artiq/master/scheduler.py#L436
    // for default params, see: artiq/dashboard/experiments.py:ExperimentManager.get_submission_scheduling
    rpc("schedule", "submit", [
        options?.pipeline_name ?? "main",
        { // expid
            file: vscode.window.activeTextEditor?.document.uri.fsPath,
            log_level: logging[options?.log_level ?? "WARNING"],
            class_name: exp.class_name,
            arguments: {},
        },
        options?.priority ?? 0,
        null, // due date
        options?.flush ?? false,
    ]);

    vscode.window.showInformationMessage(`Submitted experiment: ${exp.name}`);
};
