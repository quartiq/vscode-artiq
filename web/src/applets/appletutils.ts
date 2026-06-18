import minimist from "minimist";

export let parsePositionals = (args: minimist.ParsedArgs, names: string[]): Record<string, any> => {
    let { _, ...rest } = args;
    let positionals: Record<string, any> = {};
    _.forEach((v, i) => positionals[names[i]] = v);
    return { ...positionals, ...rest };
};

// plotly.js only eats number[]
export let normalize = (x: any): number[] => {
    if (x instanceof BigInt64Array || x instanceof BigUint64Array)
         // FIXME: this fails for BigInt values beyond the Number domain
        return Array.from(x, v => Number(v));

    return Array.from(x ?? []);
};

// FIXME: plotly.js only accepts nested arrays up to 3 levels
// but pyon.Nparray may hold an arbitrary number of levels
type NDArray = any;

export let reshape = (data: number[], dims: number[]): NDArray => {
    if (dims === undefined || dims.length === 0) return data;
    if (dims.length === 1) return data.slice(0, dims[0]);

    let [head, ...tail] = dims;
    let stride = tail.reduce((a, b) => a * b, 1);
    let slice = (i: number) => data.slice(i * stride, (i + 1) * stride);
    return Array.from({ length: head }, (_, i) => reshape(slice(i), tail));
};

export let plotel = (parent: HTMLElement) => {
    let el = document.createElement("div");
    parent.append(el);
    return el;
};