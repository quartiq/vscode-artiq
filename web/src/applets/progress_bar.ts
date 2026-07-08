import { AppletInterface } from "./types";
import { parseArgs } from "./utils";

type Subs = { counter: number };
type Locals = { min: number, max: number };

let style = document.createElement("style");
style.innerHTML = `
    .progress_bar .bar {
        background-color: lime;
        height: 100%;
    }

    .progress_bar .label {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;
document.head.appendChild(style);

export let from: AppletInterface["from"] = args => {
    let { subs, locals } = parseArgs(args, {
        positionals: [ "counter" ],
        localnames: [ "min", "max" ],
    });

    let bar: HTMLElement;
    let label: HTMLElement;

    let rel = (v: number, min: number, max: number) => (v - min) / (max - min);

    let setup = (el: HTMLElement, subs: Record<string, any>) => {
        el.classList.add("progress_bar");

        let container = document.createElement("div");

        bar = document.createElement("div");
        bar.classList.add("bar");

        label = document.createElement("div");
        label.classList.add("label");

        container.append(bar);
        container.append(label);
        el.append(container);

        let v = rel((subs as Subs).counter, (locals as Locals).min, (locals as Locals).max);
        bar.style.width = `${v * 100}%`;
        label.innerText = `${v * 100}%`;
    };

    let update = (subs: Record<string, any>) => {
        let v = rel((subs as Subs).counter, (locals as Locals).min, (locals as Locals).max);
        bar.style.width = `${v * 100}%`;
        label.innerText = `${v * 100}%`;
    };

    return { subs, setup, update, gridDefaults: { w: 7, h: 1 } };
};