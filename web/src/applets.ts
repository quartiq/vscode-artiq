import { GridStack } from "gridstack";
import * as sync_struct from "sipyco/sync_struct";

import { Datasets, Store } from "./datasets/types";
import { Applet, SubArgs, KeyString, keystr } from "./applets/types";
import * as manager from "./applets/manager";
import * as layout from "./applets/layout";
import * as ccb from "./applets/ccb";

let applets: Record<KeyString, Applet> = {};
let dirtyApplets = new Set<KeyString>();
let flushScheduled = false;
let store: Store;

let keypath = (mod: sync_struct.SetitemMod | sync_struct.DelitemMod) => {
    if (mod.path.length !== 0) return mod.path[0];
    return mod.key;
};

let deriveArgs = (argsMap: SubArgs, sets: Datasets) => Object.fromEntries(Object.entries(argsMap)
    .map(([ argName, keypath ]) => [ argName, sets.get(keypath)?.[1] ]));

let scheduleUpdate = (key: KeyString) => {
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
                applet.update(deriveArgs(applet.subs, store.struct));
            } catch (err) {
                console.error(`applets: failed to update "${k}"`, err);
            }
        });
    });
};

store = await sync_struct.from({
    masterHostname: "localhost",
    notifierName: "datasets",
    onReceive: (_, mod: sync_struct.Mod) => {
        if (mod.action === "init") return;

        Object.entries(applets)
            .filter(([ _, applet ]) => Object.values(applet.subs).includes(keypath(mod)))
            .forEach(([ k ]) => scheduleUpdate(k));
    },
});

let el = document.createElement("div");
el.classList.add("grid-stack");
document.body.append(el);

let grid = GridStack.init({ handle: ".widget-header" });
layout.newManagerItem(grid, leafs => leafs.forEach(l => {
    let k = keystr([ l.group, l.name ]);
    delete applets[k];
    dirtyApplets.delete(k);
}));

ccb.handleFuncs({

    create_applet: async args => {
        let leaf = manager.create(args);
        if (!leaf) return;

        let templateItem = await layout.newTemplateItem(args, leaf, grid);
        if (!templateItem) return;

        let { keystring, applet, host } = templateItem;
        applet.setup(host, deriveArgs(applet.subs, store.struct));
        applets[keystring] = applet; // after applet.setup() to omit race with applet.update()
    },

    restart_applet: args => {
        // TODO
    },

    disable_applet: args => {
        // TODO
    },

    disable_applet_group: args => {
        // legacy alias for calling disable_applet with "name" neglected
        // TODO
    },
});

ccb.listen();