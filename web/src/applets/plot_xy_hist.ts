import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { AppletInterface } from "./types";
import { parseArgs, normalize, reshape2d, plotel } from "./appletutils";
import { Plot, layout, config } from "./plotlyutils";

type Args = {
    xs: pyon.NpArray,
    histogram_bins: pyon.NpArray,
    histogram_counts: pyon.NpArray,
};

type Trace = (args: Args, selected: number) => Plotly.Data[];

let weightedMeans = (bins: number[], counts: number[][]): number[] => {
    let centers = bins.slice(0, -1).map((b, i) => (b + bins[i + 1]) / 2);
    let prod = (a: number[], b: number[]) => a.map((el, i) => el * b[i]);
    let sum = (ns: number[]) => ns.reduce((sum, n) => sum + n, 0);

    return counts.map(c => {
        let total = sum(c);
        return total === 0 ? Number.NaN : sum(prod(centers, c)) / total;
    });
};

let sumBins = (counts: number[][]): number[] => {
    let totals = Array(counts[0]?.length ?? 0).fill(0);
    counts.forEach(row => row.forEach((count, i) => totals[i] += count));
    return totals;
};

let traces = [
    (args: Args, selected: number): Plotly.Data[] => {
        // TODO: validate that x.length === counts.length && every row has bins.length - 1
        let x = normalize(args.xs) as number[];
        let bins = normalize(args.histogram_bins) as number[];
        let counts = reshape2d(normalize(args.histogram_counts), args.histogram_counts.__shape__) as number[][]; // FIXME: crashes sometimes

        return [{ x, y: weightedMeans(bins, counts), mode: "markers", marker: {
            color: x.map((_, i) => i === selected ? "red" : "blue"),
        } }];
    },

    (args: Args, selected: number): Plotly.Data[] => {
        // TODO: validate that x.length === counts.length && every row has bins.length - 1
        let x = normalize(args.histogram_bins) as number[];
        let counts = reshape2d(normalize(args.histogram_counts), args.histogram_counts.__shape__) as number[][];
        let y = selected === -1 ? [ ...sumBins(counts), 0 ] : [ ...counts[selected], 0 ];

        return [{ x, y, line: { shape: "hv", color: "red" } }];
    },
];

export let from: AppletInterface["from"] = args => {
    let { subs } = parseArgs(args, { positionals: [ "xs", "histogram_bins", "histogram_counts" ] });

    let cached: Args;
    let selected: number = -1;

    let plots: Plot<Trace>[];

    let setup = (el: HTMLElement, args: Record<string, any>) => {
        // create all widget partitions with plotel() before Plotly init, so width's are clear
        plots = traces.map(trace => ({ trace, layout: layout(), el: plotel(el) }));
        plots.forEach(p => Plotly.newPlot(p.el, p.trace(args as Args, selected), p.layout, config));

        cached = args as Args;
        (plots[0].el as Plotly.PlotlyHTMLElement).on("plotly_hover", (ev: Plotly.PlotMouseEvent) => {
            selected = ev.points[0].pointIndex;
            plots.forEach(p => Plotly.react(p.el, p.trace(cached, selected), p.layout));
        });
    };

    let clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

    let update = (args: Record<string, any>) => {
        cached = args as Args;
        selected = clamp(selected, -1, args.histogram_counts.length - 1);
        plots.forEach(p => Plotly.react(p.el, p.trace(args as Args, selected), p.layout));
    };

    let onResize = (ev: Event) => plots.forEach(p => Plotly.Plots.resize(p.el));

    return { subs, setup, update, onResize, gridDefaults: { w: 10, h: 4 } };
};