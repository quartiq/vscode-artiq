import shellQuote from "shell-quote";
import minimist from "minimist";
import { UnitaryArgs, Applet } from "./types";
import { Command } from "./ccb";

import * as big_number from "./templates/big_number";
import * as progress_bar from "./templates/progress_bar";
import * as plot_xy from "./templates/plot_xy";
import * as plot_hist from "./templates/plot_hist";
import * as plot_xy_hist from "./templates/plot_xy_hist";
import * as image from "./templates/image";

type Name =
    | "big_number"
    | "progress_bar"
    | "plot_xy"
    | "plot_hist"
    | "plot_xy_hist"
    | "image";

type ArgsShape = {
    positionals: string[],
    localnames?: string[],
};

type ParsedArgs = [
    subs: UnitaryArgs,
    locals: UnitaryArgs,
];

export type Interface = {
    argsShape: ArgsShape,
    from: (args: ParsedArgs) => Applet,
};

let templates: Record<Name, Interface> = {
    big_number,
    progress_bar,
    plot_xy,
    plot_hist,
    plot_xy_hist,
    image,
};

let isName = (s: string): s is Name => s in templates;

let parsePositionals = (args: minimist.ParsedArgs, names: string[]): UnitaryArgs => {
    let { _, ...rest } = args;
    let positionals: UnitaryArgs = {};
    _.forEach((v, i) => positionals[names[i]] = v);
    return { ...positionals, ...rest };
};

let parseArgs = (args: minimist.ParsedArgs, shape: ArgsShape): ParsedArgs => {
    let unit = Object.entries(parsePositionals(args, shape.positionals));
    let filter = (fn: (v: [ string, any ]) => boolean) => Object.fromEntries(unit.filter(fn));
    let localnames = shape.localnames ?? [];

    return [
        filter(([k]) => !localnames.includes(k)),
        filter(([k]) => localnames.includes(k)),
    ];
};

export let fetch = async (cmd: Command): Promise<Applet | undefined> => {
    let [name, ...argv] = shellQuote.parse(cmd) as string[];
    if (!isName(name)) {
        console.error("Applet template not yet implemented:", name);
        return undefined;
    }

    let t = templates[name];
    let parsed = parseArgs(minimist(argv), t.argsShape);
    return templates[name].from(parsed);
};