import minimist from "minimist";

export let parsePositionals = (args: minimist.ParsedArgs, names: string[]): Record<string, any> => {
    let { _, ...rest } = args;
    let positionals: Record<string, any> = {};
    _.forEach((v, i) => positionals[names[i]] = v);
    return { ...positionals, ...rest };
};

// plotly.js eats number[] only
export let normalize = (x: any): number[] => {
    if (x instanceof BigInt64Array || x instanceof BigUint64Array)
         // FIXME: this fails for actual BigInt's
        return Array.from(x, v => Number(v));

    return Array.from(x);
};