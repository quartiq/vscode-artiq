// see: m-labs/sipyco/sync_struct

import * as net from "./net";

export type Struct = {[name: string]: any};
type Mod = {action: string, struct: Struct, key: string, value: any};
type Action = (target: Struct, mod: Mod) => void;

let init = (target: Struct, mod: Mod) => Object.entries(mod.struct)
    .forEach(([key, value]: [string, any]) => target[key] = value);
let setitem = (target: Struct, mod: Mod) => target[mod.key] = mod.value;
let delitem = (target: Struct, mod: Mod) => delete target[mod.key];

let actions: {[name: string]: Action} = {init, setitem, delitem};

export let from = (params: {
    channel: string,
    onReceive: (key: string) => void,
}) => {
    let struct: Struct = {};

    net.receiver(3250, "sync_struct", params.channel).on("data", async (data: net.Bytes) => {
        let mods = net.parseLines(data);
        mods.map(async (mod: any) => {
            actions[mod.action](struct, mod);
            params.onReceive(mod.key);
        });
    });

    return struct;
};