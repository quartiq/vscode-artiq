import * as vscode from "vscode";
import * as utils from "./utils.js";
import * as net from "./net.js";
import * as argument from "./argument.js";
import * as experiment from "./experiment.js";
let submit = exp => {
    let file = vscode.window.activeTextEditor?.document.uri.fsPath;
    if (!file) {
        return;
    }
    let data = {
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
//# sourceMappingURL=run.js.map