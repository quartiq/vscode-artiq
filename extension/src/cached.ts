import * as net from "./net";
import * as mutex from "./mutex";

let updateHandler = () => {};
export let handleUpdate = (fn: () => void) => updateHandler = fn;

let actions: { [name: string]: any } = {
	init: (msg: any) => setRepoExps(Object.entries(msg.struct)),
	setitem: (msg: any) => setRepoExps([[msg.key, msg.value]]),
	delitem: (msg: any) => delRepoExp(msg.key),
};

export let evalRepoUpdate = (msg: any) => actions[msg.action](msg);

export let repoRoot: Promise<string> = new Promise(resolve => {
	net.rpc("experiment_db", "root", []).then((data: any) => resolve(data.ret));
});

export let repoExps: { [name: string]: any } = {};
export let repoExpsReady = mutex.lock();

export let setRepoExps = (entries: any) => {
	entries.forEach(([k, v]: [string, any]) => repoExps[k] = v);
	repoExpsReady.unlock();
	updateHandler();
};

export let delRepoExp = (k: string) => {
	delete repoExps[k];
	updateHandler();
};

export let examExps: { [pathColonClass: string]: any } = {};

export let setExamExps = (entries: any, path: string) => {
	entries.forEach(([class_name, exp]: [string, any]) => examExps[`${path}:${class_name}`] = {path, class_name, ...exp});
	updateHandler();
};

export let curr: any;
export let setCurr = (v: any) => curr = v;