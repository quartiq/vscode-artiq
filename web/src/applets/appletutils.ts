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
type NDArray = any;

export let reshape = (data: number[], dims: number[]): NDArray => {
    if (dims === undefined || dims.length === 0) return data;
    if (dims.length === 1) return data.slice(0, dims[0]);

    let [head, ...tail] = dims;
    let stride = tail.reduce((a, b) => a * b, 1);
    let slice = (i: number) => data.slice(i * stride, (i + 1) * stride);
    return Array.from({ length: head }, (_, i) => reshape(slice(i), tail));
};

export let plotel = (parent: HTMLElement) => {
    let el = document.createElement("div");
    parent.append(el);
    return el;
};