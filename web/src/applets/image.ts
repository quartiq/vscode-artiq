import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { AppletInterface } from "./types";
import { parseArgs, normalize, reshape2d } from "./appletutils";
import { single } from "./plotlyutils";

type Args = {
    image2d: pyon.NpArray,
};

let trace = (args: Args): Plotly.Data[] => [{
    type: "heatmap",
    // reshape data in col-major fashion to create parity with PyQtGraph.ImageView
    // see: artiq/applets/image.py
    z: reshape2d(normalize(args.image2d), args.image2d.__shape__, "col-major") as number[][],
    colorscale: "Greys",
}];

export let from: AppletInterface["from"] = args => {
    let { subs } = parseArgs(args, { positionals: [ "image2d" ] });
    return { subs, ...single(trace) };
};