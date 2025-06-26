import * as path from "path";

import * as net from "./net";
import * as dbio from "./dbio";
import * as mutex from "./mutex";

export let exps: { [name: string]: dbio.Experiment } = {};
export let ready = mutex.lock();

let root: Promise<string> = new Promise(resolve => {
	net.rpc("experiment_db", "root", []).then((data: any) => resolve(data.ret));
});

let set = async (entries: any) => {
    let basepath = await root;
	entries.forEach(([name, exp]: [string, dbio.Experiment]) => {
        let p = path.posix.join(basepath, exp.file!);
        exps[name] = {...exp, name, path: p, inRepo: true};
    });
	ready.unlock();
};

let actions: { [name: string]: (msg: any) => void } = {
	init: (msg: {struct: {[name: string]: dbio.Experiment}}) => set(Object.entries(msg.struct)),
	setitem: (msg: {key: string, value: dbio.Experiment}) => set([[msg.key, msg.value]]),
	delitem: (msg: {key: string}) => delete exps[msg.key],
};

export let update = async (msg: any) => {
    actions[msg.action](msg);
    // update "softly" to provide what is new
    // yet to sustain what was known and customized
    dbio.createAll(Object.values(exps));
};