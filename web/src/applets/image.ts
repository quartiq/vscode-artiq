import minimist from "minimist";
import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { parsePositionals, normalize, reshape } from "./appletutils";

type Args = {
    image2d: pyon.NpArray,
};

let positionals = [ "image2d" ];

let data = (args: Args): Plotly.Data[] => [{
    type: "heatmap",
    z: reshape(normalize(args.image2d), args.image2d.__shape__),
    colorscale: "Greys",
}];

export let from = (args: minimist.ParsedArgs) => {
    let gridDefaults = { w: 5, h: 4 };
    let argsMap = parsePositionals(args, positionals);

    let layout = {
        margin: { l: 0, r: 0, t: 0, b: 0 },
        xaxis: { automargin: true },
        yaxis: { automargin: true },
    };

    let plotel: HTMLElement;

    let setup = (el: HTMLElement, args: Record<string, any>) => {
        plotel = document.createElement("div");
        plotel.classList.add("image");
        el.append(plotel);
        Plotly.newPlot(plotel, data(args as Args), layout, {
            displayModeBar: false,
            responsive: true,
        });
    };

    let update = (el: HTMLElement, args: Record<string, any>) => {
        Plotly.react(plotel, data(args as Args), layout);
    };

    let onResize = (ev: Event, el: HTMLElement) => {
        Plotly.Plots.resize(plotel);
    };

    return { gridDefaults, argsMap, setup, update, onResize };
};