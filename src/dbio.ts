import * as vscode from "vscode";

import * as hostutils from "./hostutils";
import * as mutex from "./mutex";

export type SchedulerDefaults = {
	pipeline_name: string,
	priority: number,
	due_date: number,
	flush: boolean,
};

export type SubmissionOptions = {
	log_level: string,
};

export let defaults = {
	scheduler_defaults: {
		// see: artiq/dashboard/experiments.py:ExperimentManager.get_submission_scheduling
		pipeline_name: "main",
		priority: 0,
		due_date: null,
		flush: false,
	},
	submission_options: {
		// see: artiq/dashboard/experiments.py:ExperimentManager.get_submission_options
		log_level: "WARNING",
	},
};

export type Argument = [procdesc: Procdesc, group: any, tooltip: string, state: any];

// TODO: do we really want to store this or the structure
// adequate for net.submit, or in other words:
// is net.submit the only consumer of dbio?
// if so, use net.submit structure instead
export type Experiment = {
	// see "entry" in artiq/master/experiments:_RepoScanner.process_file()
	// TODO: tell apart ExperimentInfo from sync_struct and what we store in db!!!
	path: string,
	class_name: string,
	arginfo: { [name: string]: Argument },

	name: string,
	inRepo: boolean,
	file?: string, // only in repository experiments
	scheduler_defaults: SchedulerDefaults,
	submission_options: SubmissionOptions,
};

export interface Procdesc {
	ty: string,
	default: any,
}

export interface Boolean extends Procdesc {
	ty: "BooleanValue",
	default: boolean,
}

export interface Enum extends Procdesc {
	ty: "EnumerationValue",
	choices: any[],
	quickstyle: boolean,
}

export interface Number extends Procdesc {
	ty: "NumberValue",
	default: number,
	max: number,
	min: number,
	precision: number,
	scale: number,
	step: number,
	type: string,
	unit: string,
}

export interface Unixtime extends Procdesc {
	ty: "UnixtimeValue",
	default: number,
}

export interface PYON extends Procdesc {
	ty: "PYONValue",
}

export interface Scan extends Procdesc {
	ty: "Scannable",
	default: any[], // TODO: any = NoScan | RangeScan | CenterScan | ExplicitScan
	global_max: number,
	global_min: number,
	global_step: number,
	precision: number,
	scale: number,
	unit: number,
}

export interface String extends Procdesc {
	ty: "StringValue",
	default: string,
}

let db: vscode.Memento;
let updateHandler = mutex.lock();

export let init = (ctx: vscode.ExtensionContext) => db = ctx.globalState;
export let onUpdate = (fn: () => void) => updateHandler.unlock(fn);

let key = (exp: Experiment) => ["experiments", exp.path, exp.class_name].join();

export let update = (exp: Experiment) => db.update(key(exp), exp);

export let updateAll = async (exps: Experiment[]) => {
	exps.forEach(exp => db.update(key(exp), exp));
	await updateHandler.locked.then(fn => fn());
};

export let createAll = async (exps: Experiment[]) => {
	// only write if key is not yet occupied
	exps.forEach(exp => !db.get(key(exp)) && db.update(key(exp), exp));
	await updateHandler.locked.then(fn => fn());
};

export let dump = (): Record<string, any> => Object.fromEntries(db.keys().map( k => [k, db.get(k)] ));
export let flush = () => db.keys().forEach(k => db.update(k, undefined));

export let curr = async (): Promise<Experiment | undefined> => {
	if (!vscode.window.activeTextEditor) { return undefined; }

	return db.get([
		"experiments",
		vscode.window.activeTextEditor.document.uri.fsPath,
		await hostutils.selectedClass(),
	].join());
};