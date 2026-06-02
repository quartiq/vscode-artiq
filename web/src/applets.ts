import shellQuote from "shell-quote";
import minimist from "minimist";
import { GridItemHTMLElement, GridStackWidget, GridStack, Utils, GridStackElementHandler } from "gridstack";
import * as sync_struct from "sipyco/sync_struct";
import * as broadcast from "sipyco/broadcast";

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

let keyLists: { [K in CCBServiceName]: Array<keyof CCBKwargTypes[K]> } = {
    create_applet: [ "name", "command", "group", "code" ],
    restart_applet: [ "name", "group" ],
    disable_applet: [ "name", "group" ],
    disable_applet_group: [ "group" ],
};

type CCBServiceName = keyof CCBKwargTypes;

type CCBMessage<S extends CCBServiceName> = {
    service: S,
    args: CCBArgTypes[S],
    kwargs: CCBKwargTypes[S],
};

type AnyCCBMessage = {
    [S in CCBServiceName]: CCBMessage<S>
}[CCBServiceName]

let normalize = <S extends CCBServiceName>(msg: CCBMessage<S>): CCBKwargTypes[S] => {
    let keys = keyLists[msg.service] as (keyof CCBKwargTypes[S])[];
    let args = msg.args.reduce((a, v, i) => ({ ...a, [keys[i]]: v}), {});
    return { ...args, ...msg.kwargs } as CCBKwargTypes[S];
};

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

export let applets: Record<string, AppletInterface> = {
    plot_xy,
};

type Keypath = string;
type Metadata = { unit: string, scale: number, precision: number };
type Dataset = [ persist: boolean, value: any, metadata: Metadata ];
type Store = sync_struct.Store & { struct: Record<Keypath, Dataset> };
let sets: Store = await sync_struct.from({
    masterHostname: "localhost",
    notifierName: "datasets",
    onReceive: (store: sync_struct.Store, mod: sync_struct.Mod) => {},
});

type AppletName = string;
type loopId = number;
let loops: Record<AppletName, loopId> = {};

let deriveArgs = (argsMap: ArgsMap, sets: Store) => Object.fromEntries(Object.entries(argsMap)
    .map(([ argName, keypath ]) => [ argName, sets.struct[keypath][1] ]));

let newWidget = (name: string, defaults: GridStackWidget): HTMLElement => {
    let el = grid.addWidget({ id: name, ...defaults });

    let header = document.createElement("div");
    header.classList.add("widget-header");
    header.innerText = name;

    let body = document.createElement("div");
    body.classList.add("widget-body");

    el.querySelector(".grid-stack-item-content")!.append(header, body);
    return body;
};

let create = async (args: CCBKwargTypes["create_applet"]) => {

    let [name, ...argv] = shellQuote.parse(args.command) as string[];
    let applet = await applets[name].from(minimist(argv));

    let node = Utils.find(grid.engine.nodes, args.name);
    let wel = node?.el?.querySelector(".widget-body") ?? newWidget(args.name, applet.gridDefaults);

    wel.innerHTML = "";
    applet.setup(wel as HTMLElement, deriveArgs(applet.argsMap, sets));

    let loop = () => {
        // TODO don't poll, only redraw on demand
        applet.update(wel as HTMLElement, deriveArgs(applet.argsMap, sets));
        loops[args.name] = window.requestAnimationFrame(loop);
    };

    window.cancelAnimationFrame(loops[args.name]);
    loops[args.name] = window.requestAnimationFrame(loop);

    grid.on("resizestop", applet.onResize); // TODO tear this down when applet dies
};

let restart = (args: CCBKwargTypes["restart_applet"]) => {}; // TODO
let disable = (args: CCBKwargTypes["disable_applet"]) => {}; // TODO
let disableGroup = (args: CCBKwargTypes["disable_applet_group"]) => {}; // TODO

let el = document.createElement("div");
el.classList.add("grid-stack");
document.body.append(el);
let grid = GridStack.init(); // TODO separate gridstack and plotly pointer UI