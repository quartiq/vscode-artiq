import minimist from "minimist";
import Plotly from "plotly.js-dist-min";
import * as pyon from "sipyco/pyon";

import { parsePositionals, normalize, reshape, createSection } from "./appletutils";

type Args = {
    xs: pyon.NpArray,
    histogram_bins: pyon.NpArray,
    histogram_counts: pyon.NpArray,
};

let positionals = [ "xs", "histogram_bins", "histogram_counts" ];

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

let dataXy = (args: Args, selected: number): Plotly.Data[] => {
    // TODO: validate that x.length === counts.length && every row has bins.length - 1
    let x = normalize(args.xs) as number[];
    let bins = normalize(args.histogram_bins) as number[];
    let counts = reshape(normalize(args.histogram_counts), args.histogram_counts.__shape__) as number[][]; // FIXME: crashes sometimes

    return [{ x, y: weightedMeans(bins, counts), mode: "markers", marker: {
        color: x.map((_, i) => i === selected ? "red" : "blue"),
    } }];
};

let dataHist = (args: Args, selected: number): Plotly.Data[] => {
    // TODO: validate that x.length === counts.length && every row has bins.length - 1
    let x = normalize(args.histogram_bins) as number[];
    let counts = reshape(normalize(args.histogram_counts), args.histogram_counts.__shape__) as number[][];
    let y = selected === -1 ? [ ...sumBins(counts), 0 ] : [ ...counts[selected], 0 ];

    return [{ x, y, line: { shape: "hv", color: "red" } }];
};

// TODO: factor the duplication into multiplication pattern
export let from = (args: minimist.ParsedArgs) => {
    let gridDefaults = { w: 10, h: 4 };
    let argsMap = parsePositionals(args, positionals);

    let baseLayout = {
        margin: { l: 0, r: 0, t: 0, b: 0 },
        xaxis: { automargin: true },
        yaxis: { automargin: true },
    };

    let xyLayout = window.structuredClone(baseLayout);
    let histLayout = window.structuredClone(baseLayout);

    let xy: HTMLElement;
    let hist: HTMLElement;

    let cached: Args;
    let selected: number = -1;

    let setup = (el: HTMLElement, args: Record<string, any>) => {
        // create widget sections first, so plotly knows widths on init
        let plots: [ HTMLElement, Plotly.Data[], Partial<Plotly.Layout> ][] = [
            [ createSection(el), dataXy(args as Args, selected), xyLayout ],
            [ createSection(el), dataHist(args as Args, selected), histLayout ],
        ];

        [xy, hist] = plots.map(([plotel, data, layout]) => {
            Plotly.newPlot(plotel, data, layout, {
                displayModeBar: false,
                responsive: true,
            });
            return plotel;
        });

        cached = args as Args;
        (xy as Plotly.PlotlyHTMLElement).on("plotly_hover", (ev: Plotly.PlotMouseEvent) => {
            selected = ev.points[0].pointIndex;
            Plotly.react(xy, dataXy(cached, selected), xyLayout);
            Plotly.react(hist, dataHist(cached, selected), histLayout);
        });
    };

    let clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

    let update = (args: Record<string, any>) => {
        cached = args as Args;
        selected = clamp(selected, -1, args.histogram_counts.length - 1);
        Plotly.react(xy, dataXy(args as Args, selected), xyLayout);
        Plotly.react(hist, dataHist(args as Args, selected), histLayout);
    };

    let onResize = (ev: Event) => {
        Plotly.Plots.resize(xy);
        Plotly.Plots.resize(hist);
    };

    return { gridDefaults, argsMap, setup, update, onResize };
};