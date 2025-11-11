// see: m-labs/sipyco/sync_struct

import * as net from "./net";
import * as pyon from "./pyon/pyon";

export type Struct = Map<any, any>;
type Mod = { action: string, struct: Struct, path: any[], key: any, value: any };
type Action = (target: Struct, mod: Mod) => void;

// see: m-labs/artiq/frontend/artiq_master:_show_dict
const port = 3250;

let init = (target: Struct, mod: Mod) => { console.log("STRUCT", mod.struct); target = mod.struct; };

let setitem = (target: Struct, mod: Mod) => mod.path.reduce((acc, key) => acc[key], target)[mod.key] = mod.value;
let delitem = (target: Struct, mod: Mod) => delete mod.path.reduce((acc, key) => acc[key], target)[mod.key];

let actions: { [name: string]: Action } = { init, setitem, delitem };

export let from = (params: {
    channel: string,
    onReady?: () => void,
    onReceive: (mod: Mod) => void,
}) => {
    let struct: Struct;

    let r = net.receiver(port, "sync_struct", params.channel);
    if (params.onReady) { r.on("ready", params.onReady); }

    r.on("data", async (data: net.Bytes) => {
        let mods = net.parseLines(data);
        console.log("DATA", pyon.decode(data.toString()));
        console.log("MODS", mods[0].struct instanceof Map);
        mods.map(async (mod: Mod) => {
            actions[mod.action](struct!, mod);
            params.onReceive(mod);
        });
    });

    return struct!;
};