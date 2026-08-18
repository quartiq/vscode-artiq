import * as sync_struct from "sipyco/sync_struct";
import * as pyon from "sipyco/pyon";

import { Datasets, Keypath } from "../datasets/types";
import type * as ccb from "./ccb";

type ArgName = string;
export type UnitaryArgs = Record<ArgName, any>;
type SubArgs = Record<ArgName, Keypath>;

export type Applet = {
    subs: SubArgs,
    setup: (item: HTMLElement, args: UnitaryArgs) => void,
    update: (args: UnitaryArgs) => void,
};

type Key = [group: ccb.Group, name: ccb.Name];

let applets = new pyon.Dict<Key, Applet>();
let dirtyApplets = new pyon.Set<Key>();
let flushScheduled = false;

let keypath = (mod: sync_struct.SetitemMod | sync_struct.DelitemMod) => {
    if (mod.path.length !== 0) return mod.path[0];
    return mod.key;
};

let deriveArgs = (argsMap: SubArgs, sets: Datasets) => Object.fromEntries(Object.entries(argsMap)
    .map(([ argName, keypath ]) => [ argName, sets.get(keypath)?.[1] ]));

let scheduleUpdate = (key: Key, datasets: Datasets) => {
    // TODO test this, review this
    dirtyApplets.add(key);
    if (flushScheduled) return;

    flushScheduled = true;
    window.requestAnimationFrame(() => {
        flushScheduled = false;

        let pending = dirtyApplets;
        dirtyApplets = new pyon.Set();

        pending.forEach((k: Key) => {
            let applet = applets.get(k);
            if (!applet) return;

            try {
                applet.update(deriveArgs(applet.subs, datasets));
            } catch (err) {
                console.error(`applets: failed to update "${k}"`, err);
            }
        });
    });
};

let store = await sync_struct.from<Datasets>({
    masterHostname: "localhost",
    notifierName: "datasets",
    onReceive: (_, mod: sync_struct.Mod) => {
        if (mod.action === "init") return;

        applets.forEach((a: Applet, k: Key) => {
            if (!Object.values(a.subs).includes(keypath(mod))) return;
            scheduleUpdate(k, store.struct);
        });
    },
});

export let setup = (group: ccb.Group, name: ccb.Name, applet: Applet, host: HTMLElement) => {
    applet.setup(host, deriveArgs(applet.subs, store.struct));
    applets.set([ group, name ], applet); // after applet.setup() to omit race with applet.update()
};

export let remove = (group: ccb.Group, name: ccb.Name) => {
    applets.delete([ group, name ]);
    dirtyApplets.delete([ group, name ]);
};