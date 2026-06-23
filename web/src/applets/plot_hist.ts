import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { AppletInterface } from "./types";
import { parseArgs } from "./appletutils";
import { single, normalize } from "./plotlyutils";

type Args = {
    y: pyon.NpArray,
    x: pyon.NpArray,
};

let trace = (args: Args): Plotly.Data[] => {
    let y = normalize(args.y) as number[];
    let indices = (y: number[]) => y.map((y, i) => Number.isNaN(y) ? y : i);
    let x = args.x === undefined ? indices(y) : normalize(args.x) as number[];

    return [{ x, y, line: { shape: "hv" } }];
};

export let from: AppletInterface["from"] = args => {
    let { subs } = parseArgs(args, { positionals: [ "y" ] });
    return { subs, ...single(trace) };
};