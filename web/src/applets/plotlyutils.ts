import Plotly from "plotly.js-dist-min";

import { plotel } from "./appletutils";

export type Trace<Args> = (args: Args) => Plotly.Data[];
export type Plot<Trace> = { trace: Trace, layout: Partial<Plotly.Layout>, el: HTMLElement };

export let layout: () => Partial<Plotly.Layout> = () => window.structuredClone({
    margin: { l: 0, r: 0, t: 0, b: 0 },
    xaxis: { automargin: true },
    yaxis: { automargin: true },
    showlegend: false,
});

export let config: Partial<Plotly.Config> = {
    displayModeBar: false,
    responsive: true,
};

export let single = <Args>(trace: Trace<Args>) => {
    let plot: Plot<Trace<Args>>;

    let setup = (el: HTMLElement, args: Record<string, any>) => {
        plot = { trace, layout: layout(), el: plotel(el) };
        Plotly.newPlot(plot.el, plot.trace(args as Args), plot.layout, config);
    };

    let update = (args: Record<string, any>) =>
        Plotly.react(plot.el, plot.trace(args as Args), plot.layout);

    let onResize = (ev: Event) => Plotly.Plots.resize(plot.el);

    return { setup, update, onResize };
};