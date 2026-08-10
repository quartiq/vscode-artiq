import { GridStackWidget } from "gridstack";
import { Keypath } from "../datasets/types";
import { Group, Name } from "./ccb";

type ArgName = string;
export type UnitaryArgs = Record<ArgName, any>;
export type SubArgs = Record<ArgName, Keypath>;

export type Applet = {
    subs: SubArgs,
    setup: (item: HTMLElement, args: UnitaryArgs) => void,
    update: (args: UnitaryArgs) => void,
    gridDefaults?: GridStackWidget,
};

export type Key = [ Group, Name ];
export type KeyString = string;

export let keystr = ([ group, name ]: Key): KeyString => JSON.stringify([ group, name ]);
let key = (s: KeyString): Key => JSON.parse(s) as Key;