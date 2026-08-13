import * as broadcast from "sipyco/broadcast";

export type Name = string;
export type Command = string;
export type GroupEl = string;
export type Group = GroupEl[];

type ArgTypes = {
    create_applet: [ Name, Command, Group, string ],
    restart_applet: [ Name, Group ],
    disable_applet: [ Name, Group ],
    disable_applet_group: [ Group ],
};

export type KwargTypes = {
    create_applet: { name: Name, command: Command, group: Group, code: string },
    restart_applet: { name: Name, group: Group },
    disable_applet: { name: Name, group: Group },
    disable_applet_group: { group: Group },
};

type ServiceName = keyof KwargTypes;

type Message<S extends ServiceName> = {
    service: S,
    args: ArgTypes[S],
    kwargs: KwargTypes[S],
};

let keyLists: { [K in ServiceName]: Array<keyof KwargTypes[K]> } = {
    create_applet: [ "name", "command", "group", "code" ],
    restart_applet: [ "name", "group" ],
    disable_applet: [ "name", "group" ],
    disable_applet_group: [ "group" ],
};

let normalize = <S extends ServiceName>(msg: Message<S>): KwargTypes[S] => {
    let keys = keyLists[msg.service] as (keyof KwargTypes[S])[];
    let args = msg.args.reduce((a, v, i) => ({ ...a, [keys[i]]: v}), {});

    let union: KwargTypes[S] = { ...args, ...msg.kwargs };
    if (union.group === undefined) union.group = [];
    if (typeof union.group === "string") union.group = [ union.group ];
    return union;
};

type HandleFuncs = {
    [S in ServiceName]: (args: KwargTypes[S]) => void;
};
let handlers: HandleFuncs;
export let handleFuncs = (funcs: HandleFuncs) => handlers = funcs;

let queue = Promise.resolve();

export let listen = () => broadcast.subscribe({
    masterHostname: "localhost",
    targetName: "ccb",
    onReceive: <S extends ServiceName>(msg: Message<S>) => {
        let handler = handlers[msg.service];
        if (!handler) {
            console.error(`applets: unknown ccb service "${(msg as any).service}"`);
            return;
        }

        queue = queue
            .then(() => handler(normalize(msg)))
            .catch(err => console.error(`applets: failed to handle "${msg.service}"`, err));
    },
    onError: err => console.error("applets: Connection error. Is ARTIQ server running?", err),
});