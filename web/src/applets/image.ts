import minimist from "minimist";
import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { parseArgs, normalize, reshape } from "./appletutils";
import { single } from "./plotlyutils";

type Args = {
    image2d: pyon.NpArray,
};

let trace = (args: Args): Plotly.Data[] => [{
    type: "heatmap",
    z: reshape(normalize(args.image2d), args.image2d.__shape__),
    colorscale: "Greys",
}];

export let from = (args: minimist.ParsedArgs) => {
    let { subs } = parseArgs(args, { positionals: [ "image2d" ] });
    return { subs, ...single(trace) };
};