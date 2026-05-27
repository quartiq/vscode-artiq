import minimist from "minimist";

export let parsePositionals = (args: minimist.ParsedArgs, names: string[]) => {
    let { _, ...rest } = args;
    let positionals: Record<string, any> = {};
    _.forEach((v, i) => positionals[names[i]] = v);
    return { ...positionals, ...rest };
};