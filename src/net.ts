import * as vscode from "vscode";
let net = require("net");
let { once } = require("events");

import * as utils from "./utils";
import * as pyon from "./pyon/pyon";
import * as dbio from "./dbio";

type Expid = {
    arguments: Record<string, any>, // <Procdesc.ty, Argument.state>
    class_name: string,
    log_level: number,
    repo_rev?: string,
    file?: string,
}

interface SubmitInfo {
    pipeline_name: string,
    expid: Expid,
    priority: number,
    due_date: number,
    flush: boolean,
}

// FIXME: "pipeline_name" and "pipeline" should be the same thing
// see "notification" dict in artiq/scheduler.py:Run
export interface RunInfo extends Omit<SubmitInfo, "pipeline_name"> {
    pipeline: string,
    status: string,
    repo_msg: string,
}

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
export let rpc = async (target: string, method: string, args: any[], kwargs?: Record<string, any>, debug?: string) => {
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
        kwargs: kwargs ?? {},
    }) + "\n");

    let result = parseLine(await once(client, "data"));
    if (result.status === "failed") { throw new Error(JSON.stringify(result.exception)); }

    return result;
};

let parseLine = (bytes: Bytes) => pyon.decode(bytes.toString());

export let parseLines = (bytes: Bytes) => bytes.toString().trim().split("\n")
    .map((s: string) => pyon.decode(s));

export let submit = (exp: dbio.Experiment) => {
    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L381
    // see: https://github.com/m-labs/artiq/blob/master/artiq/master/scheduler.py#L436
    let stateEntries = Object.entries(exp.arginfo).map(([k, v]) => [k, v[3]]);

    let data: SubmitInfo = {
        pipeline_name: exp.scheduler_defaults.pipeline_name,
        expid: {
            file: vscode.window.activeTextEditor?.document.uri.fsPath,
            log_level: utils.logging[exp.submission_options.log_level],
            class_name: exp.class_name,
            arguments: Object.fromEntries(stateEntries),
        },
        priority: exp.scheduler_defaults.priority,
        due_date: exp.scheduler_defaults.due_date,
        flush: exp.scheduler_defaults.flush,
    };

    rpc("schedule", "submit", [], data);

    vscode.window.showInformationMessage(`Submitted experiment: ${exp.name}`);
};