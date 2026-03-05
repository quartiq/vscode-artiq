// see: m-labs/sipyco/sync_struct
import * as net from "./net.js";
import * as mutex from "./mutex.js";
import * as pyon from "./pyon/pyon.js";
import * as pyonutils from "./pyon/utils.js";
// see: m-labs/artiq/frontend/artiq_master:_show_dict
const port = 3250;
let traverse = (tree, path) => path.reduce((node, key) => {
    if (pyon.isTypeTaggedObject(node)) {
        return pyonutils.get(node, key);
    }
    return node[key];
}, tree);
let init = (struct, mod, lock) => {
    struct.data = mod.struct;
    lock.unlock();
};
let setitem = (struct, mod) => {
    let penultimate = traverse(struct.data, mod.path);
    if (pyon.isTypeTaggedObject(penultimate)) {
        return pyonutils.set(penultimate, mod.key, mod.value);
    }
    penultimate[mod.key] = mod.value;
};
let delitem = (struct, mod) => {
    let penultimate = traverse(struct.data, mod.path);
    if (pyon.isTypeTaggedObject(penultimate)) {
        return pyonutils.del(penultimate, mod.key);
    }
    delete penultimate[mod.key];
};
let actions = { init, setitem, delitem };
export let from = async (params) => {
    let struct = { data: undefined };
    let initDone = mutex.lock();
    let r = net.receiver(port, "sync_struct", params.channel);
    if (params.onReady) {
        r.on("ready", params.onReady);
    }
    r.on("data", async (data) => {
        //console.log("raw", data);
        let mods = net.parseLines(data);
        mods.map(async (mod) => {
            //console.log("parsed", mod.struct);
            actions[mod.action](struct, mod, initDone);
            params.onReceive(struct, mod);
        });
    });
    await initDone.locked; // struct.data = undefined sadly breaks TreeView.getChildren in obscure fashion
    return struct;
};
//# sourceMappingURL=syncstruct.js.map