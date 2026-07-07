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

export type AppletName = string;