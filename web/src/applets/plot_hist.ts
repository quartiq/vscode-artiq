import minimist from "minimist";
import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { parsePositionals, normalize } from "./appletutils";

type Args = {
    y: pyon.NpArray,
    x: pyon.NpArray,
};

let positionals = [ "y" ];

let data = (args: Args): Plotly.Data[] => {
    let y = normalize(args.y) as number[];
    let indices = (y: number[]) => y.map((y, i) => Number.isNaN(y) ? y : i);
    let x = args.x === undefined ? indices(y) : normalize(args.x) as number[];

    return [{ x, y, line: { shape: "hv" } }];
};

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
        el.append(plotel);
        Plotly.newPlot(plotel, data(args as Args), layout, {
            displayModeBar: false,
            responsive: true,
        });
    };

    let update = (args: Record<string, any>) => {
        Plotly.react(plotel, data(args as Args), layout);
    };

    let onResize = (ev: Event) => {
        Plotly.Plots.resize(plotel);
    };

    return { gridDefaults, argsMap, setup, update, onResize };
};