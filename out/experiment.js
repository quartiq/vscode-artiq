import * as vscode from "vscode";
import * as path from "path";
import * as dbio from "./dbio.js";
import * as net from "./net.js";
import * as hostutils from "./coreutils.js";
import * as syncstruct from "./syncstruct.js";
import * as entries from "./entries.js";
let scheduler_defaults = {
    // see: artiq/dashboard/experiments.py:ExperimentManager.get_submission_scheduling
    pipeline_name: "main",
    priority: 0,
    due_date: null,
    flush: false,
};
export let repo = { data: {} };
export let repoRoot = new Promise(resolve => {
    net.rpc("experiment_db", "root", []).then((data) => resolve(data.ret));
});
let initArgstates = arginfo => Object
    .fromEntries(Object.entries(arginfo).map(([name, arg]) => {
    // see: artiq/dashboard/experiments:ExperimentManager.initialize_submission_arguments
    arg[3] = entries.entry(arg[0].ty).getDefault(arg[0]);
    return [name, arg];
}));
repo = await syncstruct.from({
    channel: "explist",
    onReceive: async (struct) => {
        let basepath = await repoRoot;
        // update "softly" to provide what is new
        // yet to sustain what was known and customized
        createAllDb(Object.entries(struct.data).map(([name, syncinfo]) => ({
            ...scheduler_defaults, ...syncinfo.scheduler_defaults,
            path: path.posix.join(basepath, syncinfo.file),
            class_name: syncinfo.class_name,
            name,
            arginfo: initArgstates(syncinfo.arginfo),
            log_level: "WARNING", // see: artiq/dashboard/experiments.py:ExperimentManager.get_submission_options
        })));
    },
});
export let inRepo = exp => exp.name in repo.data;
export let examineFile = async () => {
    let path = vscode.window.activeTextEditor.document.uri.fsPath;
    let resp = await net.rpc("experiment_db", "examine", [path, false]);
    if (resp === undefined) {
        return;
    }
    vscode.window.showInformationMessage(`Examined file: ${resp?.status}`);
    let exps = Object.entries(resp.ret).map(([class_name, examinfo]) => ({
        ...scheduler_defaults, ...examinfo.scheduler_defaults,
        path,
        class_name,
        name: examinfo.name,
        arginfo: initArgstates(examinfo.arginfo),
        log_level: "WARNING",
    }));
    updateAllDb(exps);
};
export let curr = async () => {
    if (!vscode.window.activeTextEditor) {
        return undefined;
    }
    let className = await hostutils.selectedClass();
    if (className === "") {
        return undefined;
    }
    return dbio.get("experiments", vscode.window.activeTextEditor.document.uri.fsPath, className);
};
let key = (exp) => ["experiments", exp.path, exp.class_name].join();
export let updateDb = (exp) => dbio.update(key(exp), exp);
export let updateAllDb = async (exps) => dbio.updateAll(exps.map(e => [key(e), e]));
export let createAllDb = async (exps) => dbio.createAll(exps.map(e => [key(e), e]));
//# sourceMappingURL=experiment.js.map