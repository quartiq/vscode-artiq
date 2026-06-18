import minimist from "minimist";
import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { parsePositionals, normalize } from "./appletutils";
import { single } from "./plotlyutils";

type Args = {
    y: pyon.NpArray,
    x: pyon.NpArray,
    fit: pyon.NpArray,
    // TODO: add error arg
};

let positionals = [ "y" ];

let trace = (args: Args): Plotly.Data[] => {
    let y = normalize(args.y) as number[];
    let indices = (y: number[]) => y.map((y, i) => Number.isNaN(y) ? y : i);
    let x = args.x === undefined ? indices(y) : normalize(args.x) as number[];
    let fit = normalize(args.fit) as number[];

    return [
        { name: "data", x, y, mode: "markers" },
        { name: "fit", x, y: fit },
    ];
};

export let from = (args: minimist.ParsedArgs) => {
    let argsMap = parsePositionals(args, positionals);
    return { argsMap, ...single(trace) };
};