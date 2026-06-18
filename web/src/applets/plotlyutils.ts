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