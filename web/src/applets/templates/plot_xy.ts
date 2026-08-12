import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { Interface } from "../template";
import { single, gridDefaults, normalize } from "../plotlyutils";

type Args = {
    y: pyon.NpArray,
    x: pyon.NpArray,
    fit: pyon.NpArray,
    error: pyon.NpArray,
};

let trace = (args: Args): Plotly.Data[] => {
    let y = normalize(args.y) as number[];
    let indices = (y: number[]) => y.map((y, i) => Number.isNaN(y) ? y : i);
    let x = args.x === undefined ? indices(y) : normalize(args.x) as number[];
    let fit = normalize(args.fit) as number[];

    return [
        { name: "data", x, y, mode: "markers", error_y: {
            type: "data",
            array: normalize(args.error),
        } },
        { name: "fit", x, y: fit },
    ];
};

export let argsShape = { positionals: [ "y" ] };
export let from: Interface["from"] = ([ subs ]) => [
    { subs, ...single(trace) },
    gridDefaults,
];