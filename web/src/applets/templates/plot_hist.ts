import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { Interface } from "../template";
import { single, normalize } from "../plotlyutils";

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

export let argsShape = { positionals: [ "y" ] };
export let from: Interface["from"] = ([ subs ]) => ({ subs, ...single(trace) });