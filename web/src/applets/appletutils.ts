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

// plotly.js only eats number[]
export let normalize = (x: any): number[] => {
    if (x instanceof BigInt64Array || x instanceof BigUint64Array)
         // FIXME: this fails for BigInt values beyond the Number domain
        return Array.from(x, v => Number(v));

    return Array.from(x ?? []);
};

// FIXME: plotly.js only accepts nested arrays up to 3 levels
// but pyon.Nparray may hold an arbitrary number of levels
// FIXME: eat TypedArray and integrate normalize
export let reshape2d = (
    data: number[],
    shape: number[],
    dir: "row-major" | "col-major" = "row-major",
): number[][] => {
    let [ rows, cols ] = shape;

    if (dir === "row-major") return Array.from(
        { length: rows },
        (_, r) => data.slice(r * cols, (r + 1) * cols),
    );

    return Array.from(
        { length: cols },
        (_, c) => Array.from({ length: rows }, (_, r) => data[r * cols + c]),
    );
};

export let plotel = (parent: HTMLElement) => {
    let el = document.createElement("div");
    parent.append(el);
    return el;
};