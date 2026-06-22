import minimist from "minimist";
import { GridStackWidget, GridStackElementHandler } from "gridstack";

import { Keypath } from "../datasets/types";

type ArgName = string;
export type UnitaryArgs = Record<ArgName, any>;
export type SubArgs = Record<ArgName, Keypath>;

export type Applet = {
    subs: SubArgs,
    setup: (wel: HTMLElement, args: UnitaryArgs) => void,
    update: (args: UnitaryArgs) => void,
    onResize: GridStackElementHandler,
    gridDefaults?: GridStackWidget,
};

export type AppletInterface = {
    from: (args: minimist.ParsedArgs) => Applet,
};