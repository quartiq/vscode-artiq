import minimist from "minimist";
import { GridStackWidget } from "gridstack";

import { Keypath } from "../datasets/types";

type ArgName = string;
export type UnitaryArgs = Record<ArgName, any>;
export type SubArgs = Record<ArgName, Keypath>;

export type Applet = {
    subs: SubArgs,
    setup: (wel: HTMLElement, args: UnitaryArgs) => void,
    update: (args: UnitaryArgs) => void,
    gridDefaults?: GridStackWidget,
};

export type AppletInterface = {
    from: (args: minimist.ParsedArgs) => Applet,
};

export type Name = string;
export type GroupEl = string;
export type Group = GroupEl[];
export type Key = [ Group, Name ];
export type KeyString = string;

export let keystr = ([ group, name ]: Key): KeyString => JSON.stringify([ group, name ]);
export let key = (s: KeyString): Key => JSON.parse(s) as Key;