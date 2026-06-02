import minimist from "minimist";
import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { parsePositionals, normalize } from "../appletutils";

type Args = {
    y: pyon.NpArray,
    x: pyon.NpArray,
    fit: pyon.NpArray,
};

let positionals = [ "y" ];

let data = (args: Args): Plotly.Data[] => [{
    name: "data",
    x: normalize(args.x),
    y: normalize(args.y),
    mode: "markers",
}, {
    name: "fit",
    x: normalize(args.x),
    y: normalize(args.fit),
}];

export let from = (args: minimist.ParsedArgs) => {
    let gridDefaults = { w: 5, h: 4 };
    let argsMap = parsePositionals(args, positionals);

    let layout = {
        margin: { l: 0, r: 0, t: 0, b: 0 },
        xaxis: { automargin: true },
        yaxis: { automargin: true },
        showlegend: false
    };

    let plotel: HTMLElement;

    let setup = (el: HTMLElement, args: Record<string, any>) => {
        plotel = document.createElement("div");
        plotel.classList.add("plot_xy");
        el.append(plotel);
        Plotly.newPlot(plotel, data(args as Args), layout, {
            displayModeBar: false,
            responsive: true,
        });
    };

    let update = (el: HTMLElement, args: Record<string, any>) => {
        // FIXME: grinding to a halt?
        Plotly.react(plotel, data(args as Args), layout);
    };

    let onResize = (ev: Event, el: HTMLElement) => {
        Plotly.Plots.resize(plotel);
    };

    return { gridDefaults, argsMap, setup, update, onResize };
};