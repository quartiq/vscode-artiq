import * as vscode from "vscode";

import * as utils from "./utils.js";
import * as net from "./net.js";
import * as argument from "./argument.js";
import * as experiment from "./experiment.js";

export type Id = number;

export type Expid = {
    log_level: number,
    file: string,
    class_name: string,
    arguments: argument.SubmitInfo<argument.Procdesc>,

    devarg_override?: string,
    repo_rev?: string,
}

interface SubmitInfo extends experiment.SchedulerInfo {
    expid: Expid,
}

// FIXME: "pipeline_name" and "pipeline" should be the same thing
// see "notification" dict in artiq/master/scheduler.py:Run
export interface SyncInfo extends Omit<SubmitInfo, "pipeline_name"> {
    pipeline: string,
    expid: Expid,
    priority: number,
    due_date: number,
    flush: boolean,
    status: string,
    repo_msg: string,
}

let submit: (exp: experiment.DbInfo) => void = exp => {
    let file = vscode.window.activeTextEditor?.document.uri.fsPath;
    if (!file) { return; }

    let data: SubmitInfo = {
        pipeline_name: exp.pipeline_name,
        expid: {
            file,
            log_level: utils.logging[exp.log_level],
            class_name: exp.class_name,
            arguments: argument.toSubmitInfo(exp.arginfo),
        },
        priority: exp.priority,
        due_date: exp.due_date,
        flush: exp.flush,
    };

    net.rpc("schedule", "submit", [], data);

    vscode.window.showInformationMessage(`Submitted experiment: ${exp.name}`);
};

export let submitCurr = async () => {
    let curr = await experiment.curr();
    curr ? submit(curr) : vscode.window.showErrorMessage("Submit failed: No experiment selected.");
};