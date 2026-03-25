// see: m-labs/sipyco/sync_struct

import * as pyon from "../pyon/pyon.js";
import * as pyonutils from "../pyon/utils.js";
import * as mutex from "./mutex.js";
import * as proxy from "../proxy.js";

type Struct = Record<string, any> | pyon.Dict;
export type Store = { struct: Struct | undefined }; // we need to operate on object property singleton to utilize the mutable object pattern
export type UpdateHandler = (store: Store, mod: Mod) => void;

type InitMod = { action: "init", struct: Struct };
type SetitemMod = { action: "setitem", path: any[], key: any, value: any };
type DelitemMod = { action: "delitem", path: any[], key: any };
export type Mod = InitMod | SetitemMod | DelitemMod;
type Action = (target: Store, mod: Mod, initDone: mutex.Lock) => void;

let traverse = (tree: any, path: any[]): any => path.reduce((node, key) => {
    if (pyon.isTypeTaggedObject(node)) { return pyonutils.get(node, key); }
    return node[key];
}, tree);

let init = (store: Store, mod: Mod, lock: mutex.Lock) => {
    mod = mod as InitMod;

    store.struct = mod.struct;
    if (mod.struct.constructor.name === "Object" && Object.keys(mod.struct).length === 0) {
        // FIXME: empty dicts are sent as {}, so we auto-upgrade all of these to dicts for now
        // my occur with setitem's value property as well, but was never observed yet
        store.struct = pyonutils.create("dict", [[]]);
    }

    lock.unlock();
};

let setitem = (store: Store, mod: Mod) => {
    mod = mod as SetitemMod;

    let penultimate = traverse(store.struct, mod.path);
    if (pyon.isTypeTaggedObject(penultimate)) { return pyonutils.set(penultimate, mod.key, mod.value); }
    penultimate[mod.key] = mod.value;
};

let delitem = (store: Store, mod: Mod) => {
    mod = mod as DelitemMod;

    let penultimate = traverse(store.struct, mod.path);
    if (pyon.isTypeTaggedObject(penultimate)) { return pyonutils.del(penultimate, mod.key); }
    delete penultimate[mod.key];
};

let actions: { [name: string]: Action } = { init, setitem, delitem };

// see: https://git.m-labs.hk/M-Labs/artiq/src/branch/master/doc/manual/default_network_ports.rst
const port = 3250;

export let from = async <T extends Struct = Struct>(params: {
    masterHostname: string,
    notifierName: string,
    onReceive: (store: Store, mod: Mod) => void, // work on store directly, since onReceive's first run does not wait for init lock and local reference may be empty
    onError: (err: string) => any,
}): Promise<Store & { struct: T }> => {
    let store: Store = { struct: undefined };
    let initDone: mutex.Lock = mutex.lock();

    let chan = proxy.chan(`${params.masterHostname}:${port}`, "sync_struct", params.notifierName);

    chan.addEventListener("close", ev => {
        // see: https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
        let statusInternalError = 1011;
        if (ev.code !== statusInternalError) return;
        params.onError(ev.reason);
    });

    chan.addEventListener("message", ev => {
        let mod = pyon.decode(ev.data) as Mod;
        actions[mod.action](store, mod, initDone);
        params.onReceive(store, mod);
    });

    await initDone.locked; // FIXME store.struct = undefined sadly breaks TreeView.getChildren in obscure fashion
    return store as Store & { struct: T };
};