import shellQuote from "shell-quote";
import minimist from "minimist";
import { GridStack, GridStackWidget, GridItemHTMLElement } from "gridstack";
import * as sync_struct from "sipyco/sync_struct";
import * as broadcast from "sipyco/broadcast";

import { Datasets } from "./datasets/types";
import { Applet, Name, Group, Key, KeyString, keystr, AppletInterface, SubArgs } from "./applets/types";
import * as manager from "./applets/manager";

import * as big_number from "./applets/big_number.js";
import * as progress_bar from "./applets/progress_bar.js";
import * as plot_xy from "./applets/plot_xy.js";
import * as plot_hist from "./applets/plot_hist.js";
import * as plot_xy_hist from "./applets/plot_xy_hist.js";
import * as image from "./applets/image.js";

type TypeName =
    | "big_number"
    | "progress_bar"
    | "plot_xy"
    | "plot_hist"
    | "plot_xy_hist"
    | "image";

let isTypeName = (s: string): s is TypeName => s in appletTypes;

export let appletTypes: Record<TypeName, AppletInterface> = {
    big_number,
    progress_bar,
    plot_xy,
    plot_hist,
    plot_xy_hist,
    image,
};

let keypath = (mod: sync_struct.SetitemMod | sync_struct.DelitemMod) => {
    if (mod.path.length !== 0) return mod.path[0];
    return mod.key;
};

let dirtyApplets = new Set<KeyString>();
let flushScheduled = false;

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

type Store = sync_struct.Store & { struct: Datasets };
let store: Store = await sync_struct.from({
    masterHostname: "localhost",
    notifierName: "datasets",
    onReceive: (_: sync_struct.Store, mod: sync_struct.Mod) => {
        if (mod.action === "init") return;

        Object.entries(applets)
            .filter(([ _, applet ]) => Object.values(applet.subs).includes(keypath(mod)))
            .forEach(([ k ]) => scheduleUpdate(k));
    },
});

let applets: Record<KeyString, Applet> = {};

let deriveArgs = (argsMap: SubArgs, sets: Datasets) => Object.fromEntries(Object.entries(argsMap)
    .map(([ argName, keypath ]) => [ argName, sets.get(keypath)?.[1] ]));

let newWidget = (id: string, title: string, defaults: GridStackWidget, className?: string): GridItemHTMLElement => {
    let item = document.createElement("div");
    item.classList.add("grid-stack-item");
    if (className) item.classList.add(className);

    let content = document.createElement("div");
    content.classList.add("grid-stack-item-content");

    let header = document.createElement("div");
    header.classList.add("widget-header");
    header.innerText = title;

    let body = document.createElement("div");
    body.classList.add("widget-body");

    content.append(header, body);
    item.append(content);
    grid.el.append(item);

    // need to do it this way opposed to .addWidget()
    // to register drag area via "handle" option during init, further down
    grid.makeWidget(item, { id, ...defaults });
    return item;
};

let cacheGeometry = (wel: GridItemHTMLElement, l: manager.Leaf) => {
    if (wel.gridstackNode === undefined) return;
    let { x, y, w, h } = wel.gridstackNode;
    l.geometry = { x, y, w, h };
};

let hideWidget = (wel: GridItemHTMLElement, l: manager.Leaf) => {
    grid.removeWidget(wel, false);
    wel.classList.add("hidden");
};

let revealWidget = (wel: GridItemHTMLElement, l: manager.Leaf) => {
    let id = keystr([ l.group, l.name ]);
    grid.makeWidget(wel, { id, ...l.geometry});
    wel.classList.remove("hidden");
};

let syncVis = (wel: GridItemHTMLElement, leaf: manager.Leaf) => {
    if (leaf.visible && wel.classList.contains("hidden")) {
        revealWidget(wel, leaf);
        return;
    }

    if (!leaf.visible && !wel.classList.contains("hidden")) {
        hideWidget(wel, leaf);
    }
};

let findWidgetElement = (key: Key, grid: GridStack): GridItemHTMLElement | undefined => {
    // can not make use of Utils.find() since it holds stale DOM references during drag
    let el = grid.el.querySelector(`[gs-id="${CSS.escape(keystr(key))}"]`);
    return el as GridItemHTMLElement | undefined;
};

let createManager = (grid: GridStack) => {
    let host = newWidget("manager", "🛠️ Manage Applets", { w: 9, h: 3})
        .querySelector(".widget-body") as HTMLElement;

    let handlers = {

        onVisibilityChanged: (leafs: manager.Leaf[]) => {
            let tuples = leafs
                // insert new widgets bottom-right first, top-left last
                // don't push residing widgets all the way down
                .sort((a, b) => (b.geometry?.y ?? 0) - (a.geometry?.y ?? 0)
                    || (b.geometry?.x ?? 0) - (a.geometry?.x ?? 0))
                .map((l): [ GridItemHTMLElement | undefined, manager.Leaf ] => [ findWidgetElement([ l.group, l.name ], grid), l ])
                .filter((t): t is [ GridItemHTMLElement, manager.Leaf ] => t[0] !== undefined);

            tuples.forEach(([ wel, l ]) => cacheGeometry(wel, l));
            tuples.forEach(([ wel, l ]) => syncVis(wel, l));
        },

        onDelete: (leafs: manager.Leaf[]) => {
            leafs
                .map(l => findWidgetElement([ l.group, l.name ], grid))
                .filter(wel => wel !== undefined)
                .forEach(wel => grid.removeWidget(wel));

            leafs.forEach(l => {
                let k = keystr([ l.group, l.name ]);
                delete applets[k];
                dirtyApplets.delete(k);
            });
        },
    };

    manager.setup({ host, handlers });
};

let create = async (args: CCBKwargTypes["create_applet"], leaf: manager.Leaf | undefined) => {
    // what "args" may consist of:
    // { name: "code_applet_example", command: "code_applet_dataset", code: 'from PyQt6 import QtWidgets\n\nfrom artiq.applets.simple import SimpleApplet\n\n\nclass DemoWidget(QtWidgets.QLabel):\n    def __init__(self, args, ctl):\n        QtWidgets.QLabel.__init__(self)\n        self.dataset_name = args.dataset\n\n    def data_changed(self, value, metadata, persist, mods):\n        try:\n            n = str(value[self.dataset_name])\n        except (KeyError, ValueError, TypeError):\n            n = "---"\n        n = "<font size=15>" + n + "</font>"\n        self.setText(n)\n\n\ndef main():\n    applet = SimpleApplet(DemoWidget)\n    applet.add_dataset("dataset", "dataset to show")\n    applet.run()\n\nif __name__ == "__main__":\n    main()\n', group: "autoapplet" }
    // { name: "flopping_f", command: "${artiq_applet}plot_xy flopping_f_brightness --x flopping_f_frequency --fit flopping_f_fit" }

    if (!leaf) return;

    let [tname, ...argv] = shellQuote.parse(args.command) as string[];
    if (!isTypeName(tname)) {
        console.error("Applet type not yet implemented:", tname);
        return;
    }
    let applet = await appletTypes[tname].from(minimist(argv));

    let key: Key = [ args.group, args.name ];
    let wel = findWidgetElement(key, grid);
    if (!wel) {
        let breadcrumb = [ ...args.group, args.name ].reverse().join(" — ");
        wel = newWidget(keystr(key), breadcrumb, applet.gridDefaults ?? { w: 5, h: 4 }, "applet");
    }

    let body = wel.querySelector(".widget-body") as HTMLElement;
    body.innerHTML = "";

    applet.setup(body, deriveArgs(applet.subs, store.struct));
    applets[keystr(key)] = applet; // after applet.setup() to omit race with applet.update()
    cacheGeometry(wel, leaf);
    syncVis(wel, leaf);
};

let restart = (args: CCBKwargTypes["restart_applet"]) => {}; // TODO
let disable = (args: CCBKwargTypes["disable_applet"]) => {}; // TODO
let disableGroup = (args: CCBKwargTypes["disable_applet_group"]) => {}; // TODO

let el = document.createElement("div");
el.classList.add("grid-stack");
document.body.append(el);

let grid = GridStack.init({ handle: ".widget-header" });
createManager(grid);

let keyLists: { [K in CCBServiceName]: Array<keyof CCBKwargTypes[K]> } = {
    create_applet: [ "name", "command", "group", "code" ],
    restart_applet: [ "name", "group" ],
    disable_applet: [ "name", "group" ],
    disable_applet_group: [ "group" ],
};

let normalize = <S extends CCBServiceName>(msg: CCBMessage<S>): CCBKwargTypes[S] => {
    let keys = keyLists[msg.service] as (keyof CCBKwargTypes[S])[];
    let args = msg.args.reduce((a, v, i) => ({ ...a, [keys[i]]: v}), {});

    let union: CCBKwargTypes[S] = { ...args, ...msg.kwargs };
    if (union.group === undefined) union.group = [];
    if (typeof union.group === "string") union.group = [ union.group ];
    return union;
};

type CCBArgTypes = {
    create_applet: [ Name, string, Group, string ],
    restart_applet: [ Name, Group ],
    disable_applet: [ Name, Group ],
    disable_applet_group: [ Group ],
};

type CCBKwargTypes = {
    create_applet: { name: Name, command: string, group: Group, code: string },
    restart_applet: { name: Name, group: Group },
    disable_applet: { name: Name, group: Group },
    disable_applet_group: { group: Group },
};

type CCBServiceName = keyof CCBKwargTypes;

type CCBMessage<S extends CCBServiceName> = {
    service: S,
    args: CCBArgTypes[S],
    kwargs: CCBKwargTypes[S],
};

type AnyCCBMessage = {
    [S in CCBServiceName]: CCBMessage<S>
}[CCBServiceName];

broadcast.subscribe({
    masterHostname: "localhost",
    targetName: "ccb",
    onReceive: (msg: AnyCCBMessage) => {
        switch (msg.service) {
            case "create_applet":
                let args = normalize(msg);
                let leaf = manager.create(args);
                create(args, leaf);
                break;
            case "restart_applet":
                restart(normalize(msg));
                break;
            case "disable_applet":
                disable(normalize(msg));
                break;
            case "disable_applet_group":
                disableGroup(normalize(msg));
                break;
            default:
                console.error(`applets: unknown ccb service "${(msg as any).service}"`);
        }
    },
    onError: err => console.error("applets: Connection error. Is ARTIQ server running?", err),
});