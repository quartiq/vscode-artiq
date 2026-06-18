import minimist from "minimist";
import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { parsePositionals, normalize, plotel } from "./appletutils";
import { Trace, Plot, layout, config } from "./plotlyutils";

type Args = {
    y: pyon.NpArray,
    x: pyon.NpArray,
};

let positionals = [ "y" ];

let trace = (args: Args): Plotly.Data[] => {
    let y = normalize(args.y) as number[];
    let indices = (y: number[]) => y.map((y, i) => Number.isNaN(y) ? y : i);
    let x = args.x === undefined ? indices(y) : normalize(args.x) as number[];

    return [{ x, y, line: { shape: "hv" } }];
};

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