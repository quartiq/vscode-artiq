// see: m-labs/sipyco/sync_struct

import * as net from "./net.js";
import * as mutex from "./mutex.js";
import * as pyon from "./pyon/pyon.js";
import * as pyonutils from "./pyon/utils.js";

type Struct = Record<string, any> | pyon.Dict;
export type Store = { struct: Struct | undefined }; // we need to operate on object property singleton to utilize the mutable object pattern
export type Mod = { action: string, struct: Struct, path: any[], key: any, value: any };
type Action = (target: Store, mod: Mod, initDone: mutex.Lock) => void;

// see: m-labs/artiq/frontend/artiq_master:_show_dict
const port = 3250;

let traverse = (tree: any, path: any[]): any => path.reduce((node, key) => {
    if (pyon.isTypeTaggedObject(node)) { return pyonutils.get(node, key); }
    return node[key];
}, tree);

let init = (store: Store, mod: Mod, lock: mutex.Lock) => {
    store.struct = mod.struct;
    lock.unlock();
};

let setitem = (store: Store, mod: Mod) => {
    let penultimate = traverse(store.struct, mod.path);
    if (pyon.isTypeTaggedObject(penultimate)) { return pyonutils.set(penultimate, mod.key, mod.value); }
    penultimate[mod.key] = mod.value;
};

let delitem = (store: Store, mod: Mod) => {
    let penultimate = traverse(store.struct, mod.path);
    if (pyon.isTypeTaggedObject(penultimate)) { return pyonutils.del(penultimate, mod.key); }
    delete penultimate[mod.key];
};

let actions: { [name: string]: Action } = { init, setitem, delitem };

export let from = async <T extends Struct = Struct>(params: {
    channel: string,
    onReady?: () => void,
    onReceive: (store: Store, mod: Mod) => void, // work on store directly, since onReceive's first run does not wait for init lock and local reference may be empty
}): Promise<Store & { struct: T }> => {
    let store: Store = { struct: undefined };
    let initDone: mutex.Lock = mutex.lock();

    let r = net.receiver(port, "sync_struct", params.channel);
    if (params.onReady) { r.on("ready", params.onReady); }

    r.on("data", (data: net.Bytes) => {
        let mods = net.parseLines(data);
        mods.map((mod: Mod) => {
            actions[mod.action](store, mod, initDone);
            params.onReceive(store, mod);
        });
    });

    await initDone.locked; // FIXME store.struct = undefined sadly breaks TreeView.getChildren in obscure fashion
    return store as Store & { struct: T };
};