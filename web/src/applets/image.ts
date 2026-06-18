import minimist from "minimist";
import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { parsePositionals, normalize, plotel, reshape } from "./appletutils";
import { Trace, Plot, layout, config } from "./plotlyutils";

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

    let plot: Plot<Trace<Args>>;

    let setup = (el: HTMLElement, args: Record<string, any>) => {
        plot = { trace, layout: layout(), el: plotel(el) };
        Plotly.newPlot(plot.el, plot.trace(args as Args), plot.layout, config);
    };

    let update = (args: Record<string, any>) =>
        Plotly.react(plot.el, plot.trace(args as Args), plot.layout);

    let onResize = (ev: Event) => Plotly.Plots.resize(plot.el);

    return { argsMap, setup, update, onResize };
};