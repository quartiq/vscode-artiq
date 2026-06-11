import shellQuote from "shell-quote";
import minimist from "minimist";
import { GridStackWidget, GridStack, GridStackElementHandler } from "gridstack";
import * as sync_struct from "sipyco/sync_struct";
import * as broadcast from "sipyco/broadcast";

type AppletName = string;

type ArgName = string;
type ArgsMap = Record<ArgName, Keypath>;
type Args = Record<ArgName, any>;
type Applet = {
    gridDefaults: GridStackWidget,
    argsMap: ArgsMap,
    setup: (wel: HTMLElement, args: Args) => void,
    update: (wel: HTMLElement, args: Args) => void,
    onResize: GridStackElementHandler,
};

type AppletInterface = {
    from: (args: minimist.ParsedArgs) => Applet,
};

import * as plot_xy from "./applets/plot_xy.js";
import * as plot_hist from "./applets/plot_hist.js";
import * as image from "./applets/image.js";

export let appletTypes: Record<string, AppletInterface> = {
    plot_xy,
    plot_hist,
    image,
};

let keypath = (mod: sync_struct.SetitemMod | sync_struct.DelitemMod) => {
    if (mod.path.length !== 0) return mod.path[0];
    return mod.key;
};

let findWidgetElement = (name: AppletName): HTMLElement => {
    // can not make use of Utils.find() since it holds stale DOM references during drag
    return grid.el.querySelector(`[gs-id="${name}"] .widget-body`) as HTMLElement;
};

let dirtyApplets = new Set<AppletName>();
let flushScheduled = false;

let scheduleUpdate = (name: AppletName) => {
    // TODO test this, review this
    dirtyApplets.add(name);
    if (flushScheduled) return;

    flushScheduled = true;
    window.requestAnimationFrame(() => {
        flushScheduled = false;

        let pending = dirtyApplets;
        dirtyApplets = new Set();

        pending.forEach(name => {
            let applet = applets[name];
            let wel = findWidgetElement(name);
            try {
                applet.update(wel, deriveArgs(applet.argsMap, sets));
            } catch (err) {
                console.error(`applets: failed to update "${name}"`, err);
            }
        });
    });
};

type Keypath = string;
type Metadata = { unit: string, scale: number, precision: number };
type Dataset = [ persist: boolean, value: any, metadata: Metadata ];
type Store = sync_struct.Store & { struct: Record<Keypath, Dataset> };
let sets: Store = await sync_struct.from({
    masterHostname: "localhost",
    notifierName: "datasets",
    onReceive: (store: sync_struct.Store, mod: sync_struct.Mod) => {
        if (mod.action === "init") return;

        Object.entries(applets)
            .filter(([_, applet]) => Object.values(applet.argsMap).includes(keypath(mod)))
            .forEach(([name]) => scheduleUpdate(name));
    },
});

let applets: Record<AppletName, Applet> = {};

let deriveArgs = (argsMap: ArgsMap, sets: Store) => Object.fromEntries(Object.entries(argsMap)
    // FIXME accessed as an Object, but can we be sure it's not a pyon.Dict?
    .map(([ argName, keypath ]) => [ argName, sets.struct[keypath]?.[1] ]));

let newWidget = (name: string, defaults: GridStackWidget): HTMLElement => {
    let item = document.createElement("div");
    item.classList.add("grid-stack-item");

    let content = document.createElement("div");
    content.classList.add("grid-stack-item-content");

    let header = document.createElement("div");
    header.classList.add("widget-header");
    header.innerText = name;

    let body = document.createElement("div");
    body.classList.add("widget-body");

    content.append(header, body);
    item.append(content);
    grid.el.append(item);

    // need to do it this way opposed to .addWidget()
    // to register drag area via "handle" option during init
    grid.makeWidget(item, { id: name, ...defaults });
    return body;
};

let create = async (args: CCBKwargTypes["create_applet"]) => {
    // what "args" may consist of:
    // { name: "code_applet_example", command: "code_applet_dataset", code: 'from PyQt6 import QtWidgets\n\nfrom artiq.applets.simple import SimpleApplet\n\n\nclass DemoWidget(QtWidgets.QLabel):\n    def __init__(self, args, ctl):\n        QtWidgets.QLabel.__init__(self)\n        self.dataset_name = args.dataset\n\n    def data_changed(self, value, metadata, persist, mods):\n        try:\n            n = str(value[self.dataset_name])\n        except (KeyError, ValueError, TypeError):\n            n = "---"\n        n = "<font size=15>" + n + "</font>"\n        self.setText(n)\n\n\ndef main():\n    applet = SimpleApplet(DemoWidget)\n    applet.add_dataset("dataset", "dataset to show")\n    applet.run()\n\nif __name__ == "__main__":\n    main()\n', group: "autoapplet" }
    // { name: "flopping_f", command: "${artiq_applet}plot_xy flopping_f_brightness --x flopping_f_frequency --fit flopping_f_fit" }

    let [name, ...argv] = shellQuote.parse(args.command) as string[];
    let type = appletTypes[name];
    if (!type) {
        console.error("Applet type not yet implemented:", name);
        return;
    }
    let applet = await type.from(minimist(argv));

    let wel = findWidgetElement(args.name);
    if (!wel) wel = newWidget(args.name, applet.gridDefaults);
    wel.innerHTML = "";

    applet.setup(wel as HTMLElement, deriveArgs(applet.argsMap, sets));
    applets[args.name] = applet; // after applet.setup() to omit race with applet.update()
};

let restart = (args: CCBKwargTypes["restart_applet"]) => {}; // TODO
let disable = (args: CCBKwargTypes["disable_applet"]) => {}; // TODO
let disableGroup = (args: CCBKwargTypes["disable_applet_group"]) => {}; // TODO

let el = document.createElement("div");
el.classList.add("grid-stack");
document.body.append(el);

let grid = GridStack.init({ handle: ".widget-header" });
grid.on("resizestop", (ev, el) => applets[el.gridstackNode?.id as string].onResize(ev, el));

let keyLists: { [K in CCBServiceName]: Array<keyof CCBKwargTypes[K]> } = {
    create_applet: [ "name", "command", "group", "code" ],
    restart_applet: [ "name", "group" ],
    disable_applet: [ "name", "group" ],
    disable_applet_group: [ "group" ],
};

let normalize = <S extends CCBServiceName>(msg: CCBMessage<S>): CCBKwargTypes[S] => {
    let keys = keyLists[msg.service] as (keyof CCBKwargTypes[S])[];
    let args = msg.args.reduce((a, v, i) => ({ ...a, [keys[i]]: v}), {});
    return { ...args, ...msg.kwargs } as CCBKwargTypes[S];
};

type CCBArgTypes = {
    create_applet: [ AppletName, string, string, string ],
    restart_applet: [ AppletName, string ],
    disable_applet: [ AppletName, string ],
    disable_applet_group: [ string ],
};

type CCBKwargTypes = {
    create_applet: { name: AppletName, command: string, group: string, code: string },
    restart_applet: { name: AppletName, group: string },
    disable_applet: { name: AppletName, group: string },
    disable_applet_group: { group: string },
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
                create(normalize(msg));
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