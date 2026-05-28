import minimist from "minimist";
import Plotly from "plotly.js-dist-min";
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

    let setup = (el: HTMLElement, args: Record<string, any>) => {
        let plotel = document.createElement("div");
        plotel.classList.add("plot_xy");
        el.append(plotel);

        Plotly.newPlot(plotel, [{
            x: Array.from(args.x) as number[], // FIXME: this fails with BigInt64Array
            y: Array.from(args.y) as number[],
            mode: "markers",
        }]);
    };

    let update = (el: HTMLElement, args: Record<string, any>) => {
        // FIXME: grinding to a halt
        let plotel = el.querySelector(".plot_xy") as HTMLElement;

        Plotly.react(plotel, [{
            x: Array.from(args.x) as number[],
            y: Array.from(args.y) as number[],
            mode: "markers",
        }]);
    };

    return { argsMap, setup, update };
};