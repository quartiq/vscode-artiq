// see: m-labs/sipyco/sync_struct

import * as net from "./net.js";
import * as mutex from "./mutex.js";
import * as pyon from "./pyon/pyon.js";
import * as pyonutils from "./pyon/utils.js";

type Struct = object | pyon.Dict;
export type StructStore = { data: Struct | undefined }; // we need to operate on "data" property singleton to utilize the mutable object pattern
export type Mod = { action: string, struct: Struct, path: any[], key: any, value: any };
type Action = (target: StructStore, mod: Mod, initDone: mutex.Lock) => void;

// see: m-labs/artiq/frontend/artiq_master:_show_dict
const port = 3250;

let traverse = (tree: any, path: any[]): any => path.reduce((node, key) => {
    if (pyon.isTypeTaggedObject(node)) { return pyonutils.get(node, key); }
    return node[key];
}, tree);

let init = (struct: StructStore, mod: Mod, lock: mutex.Lock) => {
    struct.data = mod.struct;
    lock.unlock();
};

let setitem = (struct: StructStore, mod: Mod) => {
    let penultimate = traverse(struct.data, mod.path);
    if (pyon.isTypeTaggedObject(penultimate)) { return pyonutils.set(penultimate, mod.key, mod.value); }
    penultimate[mod.key] = mod.value;
};

let delitem = (struct: StructStore, mod: Mod) => {
    let penultimate = traverse(struct.data, mod.path);
    if (pyon.isTypeTaggedObject(penultimate)) { return pyonutils.del(penultimate, mod.key); }
    delete penultimate[mod.key];
};

let actions: { [name: string]: Action } = { init, setitem, delitem };

export let from = async (params: {
    channel: string,
    onReady?: () => void,
    onReceive: (struct: StructStore, mod: Mod) => void, // work on struct directly, since onReceive's first run does not wait for init lock and local reference may be empty
}): Promise<StructStore> => {
    let struct: StructStore = { data: undefined };
    let initDone: mutex.Lock = mutex.lock();

    let r = net.receiver(port, "sync_struct", params.channel);
    if (params.onReady) { r.on("ready", params.onReady); }

    r.on("data", async (data: net.Bytes) => {
        //console.log("raw", data);
        let mods = net.parseLines(data);
        mods.map(async (mod: Mod) => {
            //console.log("parsed", mod.struct);
            actions[mod.action](struct, mod, initDone);
            params.onReceive(struct, mod);
        });
    });

    await initDone.locked; // struct.data = undefined sadly breaks TreeView.getChildren in obscure fashion
    return struct;
};