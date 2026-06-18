import minimist from "minimist";
import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { parsePositionals, normalize, plotel, reshape } from "./appletutils";
import { single } from "./plotlyutils";

type Args = {
    image2d: pyon.NpArray,
};

let positionals = [ "image2d" ];

let trace = (args: Args): Plotly.Data[] => [{
    type: "heatmap",
    z: reshape(normalize(args.image2d), args.image2d.__shape__),
    colorscale: "Greys",
}];

export let from = (args: minimist.ParsedArgs) => {
    let argsMap = parsePositionals(args, positionals);
    return { argsMap, ...single(trace) };
};