// see: m-labs/sipyco/sync_struct

import * as net from "./net";

export type Struct = { [name: string]: any };
type Mod = { action: string, struct: Struct, path: [], key: string, value: any };
type Action = (target: Struct, mod: Mod) => void;

// see: m-labs/artiq/frontend/artiq_master:_show_dict
const port = 3250;

let init = (target: Struct, mod: Mod) => Object.entries(mod.struct)
    .forEach(([key, value]: [string, any]) => target[key] = value);
let setitem = (target: Struct, mod: Mod) => mod.path.reduce((acc, key) => acc[key], target)[mod.key] = mod.value;
let delitem = (target: Struct, mod: Mod) => delete mod.path.reduce((acc, key) => acc[key], target)[mod.key];

let actions: { [name: string]: Action } = { init, setitem, delitem };

export let from = (params: {
    channel: string,
    onReady?: () => void,
    onReceive: (key: string) => void,
}) => {
    let struct: Struct = {};

    let r = net.receiver(port, "sync_struct", params.channel);
    if (params.onReady) { r.on("ready", params.onReady); }

    r.on("data", async (data: net.Bytes) => {
        let mods = net.parseLines(data);
        mods.map(async (mod: any) => {
            actions[mod.action](struct, mod);
            params.onReceive(mod.key);
        });
    });

    return struct;
};