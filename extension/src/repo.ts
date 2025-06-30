import * as path from "path";

import * as net from "./net";
import * as dbio from "./dbio";

export let exps: { [name: string]: dbio.Experiment } = {};

let root: Promise<string> = new Promise(resolve => {
	net.rpc("experiment_db", "root", []).then((data: any) => resolve(data.ret));
});

let set = async (entries: any) => {
    let basepath = await root;
	entries.forEach(([name, exp]: [string, dbio.Experiment]) => {
        let p = path.posix.join(basepath, exp.file!);
        exps[name] = {...exp, name, path: p, inRepo: true};
    });
};

let actions: { [name: string]: (msg: any) => void } = {
	init: async (msg: {struct: {[name: string]: dbio.Experiment}}) => await set(Object.entries(msg.struct)),
	setitem: async (msg: {key: string, value: dbio.Experiment}) => await set([[msg.key, msg.value]]),
	delitem: (msg: {key: string}) => delete exps[msg.key],
};

let update = async (msg: any) => {
    await actions[msg.action](msg);
    // update "softly" to provide what is new
    // yet to sustain what was known and customized
    dbio.createAll(Object.values(exps));
};

export let updateAll = async (msgs: any[]) => {
    await Promise.all(msgs.map(async (msg: any) => await update(msg)));
};