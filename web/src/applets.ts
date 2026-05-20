import { GridStack, Utils } from "gridstack";
import * as broadcast from "sipyco/broadcast";

type ArgTypes = {
    create_applet: [ string, string, string, string ],
    restart_applet: [ string, string ],
    disable_applet: [ string, string ],
    disable_applet_group: [ string ],
};

type KwargTypes = {
    create_applet: { name: string, command: string, group: string, code: string },
    restart_applet: { name: string, group: string },
    disable_applet: { name: string, group: string },
    disable_applet_group: { group: string },
};

type ServiceName = keyof KwargTypes;

type CCBMessage<S extends ServiceName> = {
    service: S,
    args: ArgTypes[S],
    kwargs: KwargTypes[S],
};

type AnyCCBMessage = {
    [S in ServiceName]: CCBMessage<S>
}[ServiceName]

let keyLists: { [K in ServiceName]: Array<keyof KwargTypes[K]> } = {
    create_applet: [ "name", "command", "group", "code" ],
    restart_applet: [ "name", "group" ],
    disable_applet: [ "name", "group" ],
    disable_applet_group: [ "group" ],
};

let normalize = <S extends ServiceName>(msg: CCBMessage<S>): KwargTypes[S] => {
    let keys = keyLists[msg.service] as (keyof KwargTypes[S])[];
    let args = msg.args.reduce((a, v, i) => ({ ...a, [keys[i]]: v}), {});
    return { ...args, ...msg.kwargs } as KwargTypes[S];
};

let create = (args: KwargTypes["create_applet"]) => {
    let w = Utils.find(grid.engine.nodes, args.name);
    if (w && w.el) {
        grid.update(w.el, { content: "UPDATED" });
        return;
    }

    grid.addWidget({ id: args.name, w: 2, content: "FOOOBAR" });
};

let restart = (args: KwargTypes["restart_applet"]) => {}; // TODO
let disable = (args: KwargTypes["disable_applet"]) => {}; // TODO
let disableGroup = (args: KwargTypes["disable_applet_group"]) => {}; // TODO

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

let el = document.createElement("div");
el.classList.add("grid-stack");
document.body.append(el);
let grid = GridStack.init();