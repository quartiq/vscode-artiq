import * as argument from "./argument.js";
import * as scan from "./scan.js";

export type Info<P extends argument.Procdesc> = {
    arg: argument.Argument<P>,
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

export type Editor<P extends argument.Procdesc> = (info: Info<P>) => HTMLElement;

export let buttons: Editor<argument.Enum> = info => {
    let el = document.createElement("div");

    info.arg[0].choices.forEach((c: string) => {
        let cel = document.createElement("input");
        cel.setAttribute("type", "button");
        cel.setAttribute("value", c);
        cel.addEventListener("click", ev => {
            info.success(c);
            info.post( {action: "submit"} );
        });
        el.append(cel);
    });

    info.onRendered(() => el.focus());
    el.addEventListener("keydown", ev => ev.key === "Escape" && info.cancel());

    return el;
};

export let select: Editor<argument.Enum> = info => {
    let el = document.createElement("select");

    info.arg[0].choices.forEach((c: string) => {
        let cel = document.createElement("option");
        cel.textContent = c;
        cel.setAttribute("value", c);
        el.append(cel);
    });
    el.value = info.cell.getValue(); // must be set after option creation

    info.onRendered(() => el.focus());
    el.addEventListener("change", () => info.success(el.value));
    el.addEventListener("keydown", ev => ev.key === "Escape" && info.cancel());

    return el;
};

export let input: Editor<argument.Procdesc> = info => {
    let el = document.createElement("input");
    el.value = info.cell.getValue();

    info.onRendered(() => el.focus());
    el.addEventListener("blur", () => info.success(info.parse(el)));
    el.addEventListener("keydown", ev => {
        if (ev.key === "Enter") { info.success(info.parse(el)); }
        if (ev.key === "Escape") { info.cancel(); }
    });

    return el;
};

export let scanform: Editor<argument.Scannable> = info => {
    let el = scan.editor();

    let type = info.arg[3].selected;
    el.querySelector("select")!.value = type;
    el.querySelectorAll("section").forEach(section => {
        section.classList.add("hidden");
        if (section.classList.contains(type)) {
            section.classList.remove("hidden");
        }
    });

    Object.entries(info.arg[3])
        .filter(([ key ]) => key !== "selected")
        .forEach(([ ty, scanobject ]) => {
            Object.entries(scanobject)
                .filter(([ key ]) => key !== "ty")
                .forEach(([ prop, val ]) => {
                    let input = el.querySelector(`input#${ty}__${prop}`) as HTMLInputElement;
                    scan.populate(input, val as scan.Value);
                });
        });

    el.querySelector(".button.save")!.addEventListener("click", ev => {
        let state: scan.ScanState = {} as scan.ScanState;
        state.selected = el.querySelector("select")!.value;

        el.querySelectorAll("input").forEach(input => {
		    let [ty, prop] = input.id.split("__");
            (state[ty] ??= {})[prop] = scan.parse(input);
        });

        info.success(state);
        el.remove();
        document.body.classList.remove("noscroll");
    });

    el.querySelector(".button.discard")!.addEventListener("click", ev => {
        info.cancel();
        el.remove();
        document.body.classList.remove("noscroll");
    });

    document.body.appendChild(el);
    document.body.classList.add("noscroll");
    return document.createElement("div"); // no-op to satisfy return type;
};