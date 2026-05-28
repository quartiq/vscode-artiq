import minimist from "minimist";
import * as pyon from "sipyco/pyon";

import { parsePositionals } from "../appletutils";

type Args = {
    y: pyon.NpArray,
    x: pyon.NpArray,
    fit: pyon.NpArray,
};

let positionals = [ "y" ];

export let from = (args: minimist.ParsedArgs) => {
    let argsMap = parsePositionals(args, positionals);
    let draw = (args: Record<string, any>) => pyon.encode(args as Args);
    return { argsMap, draw };
};