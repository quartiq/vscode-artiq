// see: m-labs/sipyco/sync_struct

import * as net from "./net";
import * as mutex from "./mutex";
import * as pyon from "./pyon/pyon";
import * as pyonutils from "./pyon/utils";

type Struct = { data: any }; // we need to operate on "data" property singleton to utilize the mutable object pattern
type Mod = { action: string, struct: Struct, path: any[], key: any, value: any };
type Action = (target: Struct, mod: Mod, lock: mutex.Lock) => void;

// see: m-labs/artiq/frontend/artiq_master:_show_dict
const port = 3250;

let traverse = (tree: any, path: any[]): any => path.reduce((node, key) => {
    if (pyon.isTypeTaggedObject(node)) { return pyonutils.get(node, key); }
    return node[key];
}, tree);

let init = (struct: Struct, mod: Mod, lock: mutex.Lock) => {
    struct.data = mod.struct;
    lock.unlock();
};

let setitem = (struct: Struct, mod: Mod) => {
    let penultimate = traverse(struct.data, mod.path);
    if (pyon.isTypeTaggedObject(penultimate)) { return pyonutils.set(penultimate, mod.key, mod.value); }
    penultimate[mod.key] = mod.value;
};

let delitem = (struct: Struct, mod: Mod) => {
    let penultimate = traverse(struct.data, mod.path);
    if (pyon.isTypeTaggedObject(penultimate)) { return pyonutils.del(penultimate, mod.key); }
    delete penultimate[mod.key];
};

let actions: { [name: string]: Action } = { init, setitem, delitem };

export let from = async (params: {
    channel: string,
    onReady?: () => void,
    onReceive: (mod: Mod) => void,
}): Promise<Struct> => {
    let struct: Struct = { data: undefined };
    let lock: mutex.Lock = mutex.lock();

    let r = net.receiver(port, "sync_struct", params.channel);
    if (params.onReady) { r.on("ready", params.onReady); }

    r.on("data", async (data: net.Bytes) => {
        let mods = net.parseLines(data);
        mods.map(async (mod: Mod) => {
            actions[mod.action](struct, mod, lock);
            params.onReceive(mod);
        });
    });

    await lock.locked; // struct.data = undefined sadly breaks TreeView.getChildren in obscure fashion
    return struct;
};