import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { AppletInterface } from "./types";
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

export let from: AppletInterface["from"] = args => {
    let { subs } = parseArgs(args, { positionals: [ "image2d" ] });
    return { subs, ...single(trace) };
};