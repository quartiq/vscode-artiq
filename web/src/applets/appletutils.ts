import minimist from "minimist";

import { UnitaryArgs } from "./types";

let parsePositionals = (args: minimist.ParsedArgs, names: string[]): UnitaryArgs => {
    let { _, ...rest } = args;
    let positionals: UnitaryArgs = {};
    _.forEach((v, i) => positionals[names[i]] = v);
    return { ...positionals, ...rest };
};

type ArgsInfo = {
    positionals: string[],
    localnames?: string[],
};

type ParsedArgs = {
    subs: UnitaryArgs,
    locals: UnitaryArgs,
};

export let parseArgs = (args: minimist.ParsedArgs, argsinfo: ArgsInfo): ParsedArgs => {
    let unit = Object.entries(parsePositionals(args, argsinfo.positionals));
    let filter = (fn: (v: [ string, any ]) => boolean) => Object.fromEntries(unit.filter(fn));
    let localnames = argsinfo.localnames ?? [];

    return {
        subs: filter(([k]) => !localnames.includes(k)),
        locals: filter(([k]) => localnames.includes(k)),
    };
};

export let plotel = (parent: HTMLElement) => {
    let el = document.createElement("div");
    parent.append(el);
    return el;
};