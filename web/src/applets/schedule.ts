import * as sync_struct from "sipyco/sync_struct";

import { Datasets, Keypath } from "../datasets/types";
import { KeyString, keystr } from "./types";
import { Group, Name } from "./ccb";

type ArgName = string;
export type UnitaryArgs = Record<ArgName, any>;
type SubArgs = Record<ArgName, Keypath>;

export type Applet = {
    subs: SubArgs,
    setup: (item: HTMLElement, args: UnitaryArgs) => void,
    update: (args: UnitaryArgs) => void,
};

let applets: Record<KeyString, Applet> = {};
let dirtyApplets = new Set<KeyString>();
let flushScheduled = false;

let keypath = (mod: sync_struct.SetitemMod | sync_struct.DelitemMod) => {
    if (mod.path.length !== 0) return mod.path[0];
    return mod.key;
};

let deriveArgs = (argsMap: SubArgs, sets: Datasets) => Object.fromEntries(Object.entries(argsMap)
    .map(([ argName, keypath ]) => [ argName, sets.get(keypath)?.[1] ]));

let scheduleUpdate = (key: KeyString, datasets: Datasets) => {
    // TODO test this, review this
    dirtyApplets.add(key);
    if (flushScheduled) return;

    flushScheduled = true;
    window.requestAnimationFrame(() => {
        flushScheduled = false;

        let pending = dirtyApplets;
        dirtyApplets = new Set();

        pending.forEach(k => {
            let applet = applets[k];
            try {
                applet.update(deriveArgs(applet.subs, datasets));
            } catch (err) {
                console.error(`applets: failed to update "${k}"`, err);
            }
        });
    });
};

let store = await sync_struct.from({
    masterHostname: "localhost",
    notifierName: "datasets",
    onReceive: (_, mod: sync_struct.Mod) => {
        if (mod.action === "init") return;

        Object.entries(applets)
            .filter(([ _, applet ]) => Object.values(applet.subs).includes(keypath(mod)))
            .forEach(([ k ]) => scheduleUpdate(k, store.struct));
    },
});

export let setup = (group: Group, name: Name, applet: Applet, host: HTMLElement) => {
    applet.setup(host, deriveArgs(applet.subs, store.struct));
    let k = keystr([ group, name ]);
    applets[k] = applet; // after applet.setup() to omit race with applet.update()
};

export let remove = (group: Group, name: Name) => {
    let k = keystr([ group, name ]);
    delete applets[k];
    dirtyApplets.delete(k);
};