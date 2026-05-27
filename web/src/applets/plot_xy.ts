import minimist from "minimist";

import { parsePositionals } from "../appletutils";

let positionals = [ "y" ];

export let from = (args: minimist.ParsedArgs) => {
    let argsMap = parsePositionals(args, positionals);
    console.log(argsMap);
};