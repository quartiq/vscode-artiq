import * as vscode from "vscode";
import * as path from "path";

import * as dbio from "./dbio.js";
import * as net from "./net.js";
import * as argument from "./argument.js";
import * as hostutils from "./hostutils.js";
import * as syncstruct from "./syncstruct.js";
import * as entries from "./entries.js";

type Name = string
type ClassName = string

export interface SchedulerInfo {
	pipeline_name: string,
	priority: number,
	due_date: number | null,
	flush: boolean,
};

let scheduler_defaults: SchedulerInfo = {
    // see: artiq/dashboard/experiments.py:ExperimentManager.get_submission_scheduling
    pipeline_name: "main",
    priority: 0,
    due_date: null,
    flush: false,
};

export interface DbInfo extends SchedulerInfo {
    // path and class_name are the primary key of any experiment
	path: string, // full absolute filepath, derived by client
	class_name: string,

    name: string, // unique name derived from class_name by server
	arginfo: argument.SyncInfo,

	log_level: string, // see utils.logging()
};

type SyncInfo = {
    file: string,
    class_name: ClassName,

	arginfo: argument.SyncInfo,
    argument_ui: string,
    scheduler_defaults: SchedulerInfo,
}

type SyncDict = Record<Name, SyncInfo>

type Struct = { data: SyncDict };
export let repo: Struct = { data: {} };

export let repoRoot: Promise<string> = new Promise(resolve => {
	net.rpc("experiment_db", "root", []).then((data: any) => resolve(data.ret));
});

let initArgstates: (arginfo: argument.SyncInfo) => argument.SyncInfo = arginfo => Object
    .fromEntries(Object.entries(arginfo).map(([name, arg]) => {
        // see: artiq/dashboard/experiments:ExperimentManager.initialize_submission_arguments
        arg[3] = entries.entry(arg[0].ty)!.getDefault(arg[0]);
        return [name, arg];
    }));

repo = await syncstruct.from({
    channel: "explist",
    onReceive: async (struct: Struct) => {
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

export let inRepo: (exp: DbInfo) => Boolean = exp => exp.name in repo.data;

type ExamineInfo = {
    name: Name,

    arginfo: argument.SyncInfo,
    argument_ui: string,
    scheduler_defaults: SchedulerInfo,
}

type ExamineDict = Record<ClassName, ExamineInfo>
interface RpcObject extends net.RpcObject {
    ret: ExamineDict,
}

export let examineFile: () => Promise<void> = async () => {
    let path = vscode.window.activeTextEditor!.document.uri.fsPath;
    let resp: RpcObject | undefined = await net.rpc("experiment_db", "examine", [path, false]);
    if (resp === undefined) { return; }

    vscode.window.showInformationMessage(`Examined file: ${resp?.status}`);
    let exps: DbInfo[] = Object.entries(resp.ret).map( ([class_name, examinfo]: [ClassName, ExamineInfo]) => ({
        ...scheduler_defaults, ...examinfo.scheduler_defaults,

        path,
        class_name,
        
        name: examinfo.name,
        arginfo: initArgstates(examinfo.arginfo),

        log_level: "WARNING",
    }) );

    updateAllDb(exps);
};

export let curr = async (): Promise<DbInfo | undefined> => {
	if (!vscode.window.activeTextEditor) { return undefined; }
    let className = await hostutils.selectedClass();
    if (className === "") { return undefined; }

	return dbio.get(
		"experiments",
		vscode.window.activeTextEditor.document.uri.fsPath,
		className,
	);
};

let key = (exp: DbInfo) => ["experiments", exp.path, exp.class_name].join();
export let updateDb = (exp: DbInfo) => dbio.update(key(exp), exp);
export let updateAllDb = async (exps: DbInfo[]) => dbio.updateAll(exps.map(e => [key(e), e]));
export let createAllDb = async (exps: DbInfo[]) => dbio.createAll(exps.map(e => [key(e), e]));