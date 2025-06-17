import * as net from "./net";
import * as mutex from "./mutex";

let actions: {[name: string]: any} = {
	init: (msg: any) => setRepoExps(Object.entries(msg.struct)),
	setitem: (msg: any) => setRepoExps([[msg.key, msg.value]]),
	delitem: (msg: any) => delRepoExp(msg.key),
};

export let evalRepoUpdate = (msg: any) => actions[msg.action](msg);

export let repoRoot: Promise<string> = new Promise(resolve => {
	net.rpc("experiment_db", "root", []).then((data: any) => resolve(data.ret));
});

export let repoExps: {[key: string]: any} = {};
export let repoExpsReady = mutex.lock();

export let setRepoExps = (entries: any) => {
    entries.forEach(([k, v]: [string, any]) => repoExps[k] = v);
	repoExpsReady.unlock();
};

export let delRepoExp = (k: string) => {
    delete repoExps[k];
};

export let curr: any;
export let setCurr = (v: any) => curr = v;