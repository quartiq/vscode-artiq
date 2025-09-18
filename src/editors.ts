import * as dbio from "./dbio";

export type Args<P extends dbio.Procdesc> = {
    procdesc: P,
    parse: (el: HTMLElement) => any,
    post: Function, // TODO: make "acquireVsCodeApi()" accessable in webview ts
    // TODO: use actual types for Tabulator specific args, not "any"
    cell: any,
    onRendered: any,
    success: any,
    cancel: any,
};

export type Editor<P extends dbio.Procdesc> = (args: Args<P>) => HTMLElement;

export let buttons = (args: Args<dbio.Enum>) => {
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

export let select = (args: Args<dbio.Enum>) => {
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

export let input = (args: Args<dbio.Procdesc>) => {
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