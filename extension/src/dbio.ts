import * as vscode from "vscode";

import * as utils from "./utils";

export type SchedulerDefaults = {
	pipeline_name: string,
	priority: number,
	due_date: null, // FIXME: use proper datatype
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

// TODO do we really want to store this or the structure
// adequate for net.submit, or in other words:
// is net.submit the only consumer of dbio?
// if so, use net.submit structure instead
export type Experiment = {
	path: string,
	class_name: string,

	name: string,
	inRepo: boolean,
	file?: string, // only in repository experiments
	scheduler_defaults: SchedulerDefaults,
	submission_options: SubmissionOptions,
};

let db: vscode.Memento;
let updateHandler: () => void;

export let init = (ctx: vscode.ExtensionContext) => db = ctx.globalState;
export let onUpdate = (fn: () => void) => updateHandler = fn;

let key = (exp: Experiment) => ["experiments", exp.path, exp.class_name].join();

export let update = (exp: Experiment) => db.update(key(exp), exp);

export let updateAll = (exps: Experiment[]) => {
	exps.forEach(exp => db.update(key(exp), exp));
	updateHandler();
};

export let createAll = (exps: Experiment[]) => {
	// only write if key is not yet occupied
	exps.forEach(exp => !db.get(key(exp)) && db.update(key(exp), exp));
	updateHandler();
};

export let flush = () => db.keys().forEach(k => db.update(k, undefined));

export let curr = async (): Promise<Experiment | undefined> => db.get([
	"experiments",
	vscode.window.activeTextEditor!.document.uri.fsPath,
	await utils.selectedClass(),
].join());