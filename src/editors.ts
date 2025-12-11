import * as argument from "./argument.js";

export type Args<P extends argument.Procdesc> = {
    procdesc: P,
    parse: (el: HTMLElement) => any,
    // type refers to: acquireVsCodeApi().postMessage
    // TODO: make "acquireVsCodeApi()" accessable in webview ts
    post: (message: any) => void,
    // TODO: use actual types for Tabulator specific args, not "any"
    cell: any,
    onRendered: any,
    success: any,
    cancel: any,
};

export type Editor<P extends argument.Procdesc> = (args: Args<P>) => HTMLElement;

export let buttons = (args: Args<argument.Enum>) => {
    let el = document.createElement("div");

    args.procdesc.choices.forEach((c: string) => {
        let cel = document.createElement("input");
        cel.setAttribute("type", "button");
        cel.setAttribute("value", c);
        cel.addEventListener("click", ev => {
            args.success(c);
            args.post( {action: "submit"} );
        });
        el.append(cel);
    });

    args.onRendered(() => el.focus());
    el.addEventListener("keydown", ev => ev.key === "Escape" && args.cancel());

    return el;
};

export let select = (args: Args<argument.Enum>) => {
    let el = document.createElement("select");

    args.procdesc.choices.forEach((c: string) => {
        let cel = document.createElement("option");
        cel.textContent = c;
        cel.setAttribute("value", c);
        el.append(cel);
    });
    el.value = args.cell.getValue(); // must be set after option creation

    args.onRendered(() => el.focus());
    el.addEventListener("change", () => args.success(el.value));
    el.addEventListener("keydown", ev => ev.key === "Escape" && args.cancel());

    return el;
};

export let input = (args: Args<argument.Procdesc>) => {
    let el = document.createElement("input");
    el.value = args.cell.getValue();

    args.onRendered(() => el.focus());
    el.addEventListener("blur", () => args.success(args.parse(el)));
    el.addEventListener("keydown", ev => {
        if (ev.key === "Enter") { args.success(args.parse(el)); }
        if (ev.key === "Escape") { args.cancel(); }
    });

    return el;
};