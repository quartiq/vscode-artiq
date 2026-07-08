import { AppletInterface } from "./types";
import { parseArgs } from "./utils";

type Subs = { scalar: number };
type Locals = { "digit-count": number };

let style = document.createElement("style");
style.innerHTML = `
    .big_number {
        font-family: monospace;
        font-size: 72px;
    }
`;
document.head.appendChild(style);

export let from: AppletInterface["from"] = args => {
    let { subs, locals } = parseArgs(args, {
        positionals: [ "scalar" ],
        localnames: [ "digit-count" ],
    });

    let parent: HTMLElement;

    // TODO: Add unit symbol
    let fmt = (f: number, n: number) => new Intl.NumberFormat("en-EN", { useGrouping: false, maximumSignificantDigits: n }).format(f);

    let setup = (el: HTMLElement, subs: Record<string, any>) => {
        parent = el;
        parent.classList.add("big_number");
        parent.innerText = fmt((subs as Subs).scalar, (locals as Locals)["digit-count"]);
    };

    let update = (subs: Record<string, any>) =>
        parent.innerText = fmt((subs as Subs).scalar, (locals as Locals)["digit-count"]);

    return { subs, setup, update, gridDefaults: { w: 5, h: 2 } };
};