import * as vscode from "vscode";
let net = require("net");
let { once } = require("events");

import * as pyon from "./pyon";
import * as dbio from "./dbio";

export type Bytes = {type: "Buffer", data: number[]};

const host = vscode.workspace.getConfiguration("artiq").get("host");

export let receiver = (port: number, banner: string, target: string) => {
    // TODO: use "readline" module wrapper, make "parseLine(s)" save to use
    let client = new net.Socket();

    client.connect(port, host, () => {
        client.write("ARTIQ " + banner + "\n");
        client.write(target + "\n");
    });

    client.on("connectionAttemptFailed", () => vscode.window.showErrorMessage("Connection error. Is ARTIQ server running?"));
    return client;
};

// TODO: use kwargs instead of args, less ugly
export let rpc = async (target: string, method: string, args: any[], debug?: string) => {
    let client = new net.Socket();
    client.connect(3251, host);

    await once(client, "connect");

    client.write("ARTIQ pc_rpc\n");
    let response = parseLine(await once(client, "data"));

    if (!response.targets.includes(target)) {
        vscode.window.showErrorMessage("RPC target not found. Custom port in use?");
        return;
    }

    if (!response.features.includes("pyon_v2")) {
        vscode.window.showErrorMessage("PYON v2 not supported. ARTIQ update may help.");
        return;
    }

    if (debug === "targets") { return response; }

    client.write(target + " pyon_v2\n");
    response = parseLine(await once(client, "data"));
    if (debug === "methods") { return response; }

    client.write(pyon.encode({
        action: "call",
        name: method,
        args: args,
        kwargs: {},
    }) + "\n");

    return parseLine(await once(client, "data"));
};

let parseLine = (bytes: Bytes) => pyon.decode(bytes.toString());

export let parseLines = (bytes: Bytes) => bytes.toString().trim().split("\n")
    .map((s: string) => pyon.decode(s));

export let logging: { [name: string]: number } = {
    // see: https://docs.python.org/3/library/logging.html#logging-levels
    NOTSET: 0,
    DEBUG: 10,
    INFO: 20,
    WARNING: 30,
    ERROR: 40,
    CRITICAL: 50,
};

let submit = (exp: dbio.Experiment) => {
    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L381
    // see: https://github.com/m-labs/artiq/blob/master/artiq/master/scheduler.py#L436
    let argEntries = Object.entries(exp.arginfo).map(entry => [entry[0], entry[1][3]]);

    rpc("schedule", "submit", [
        exp.scheduler_defaults.pipeline_name,
        { // expid
            file: vscode.window.activeTextEditor?.document.uri.fsPath,
            log_level: logging[exp.submission_options.log_level],
            class_name: exp.class_name,
            arguments: Object.fromEntries(argEntries),
        },
        exp.scheduler_defaults.priority,
        exp.scheduler_defaults.due_date,
        exp.scheduler_defaults.flush,
    ]);

    vscode.window.showInformationMessage(`Submitted experiment: ${exp.name}`);
};

export let submitCurr = async () => {
    let curr = await dbio.curr();
    curr ? submit(curr) : vscode.window.showErrorMessage("Submit failed: No experiment selected.");
};