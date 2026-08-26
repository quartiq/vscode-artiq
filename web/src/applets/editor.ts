import * as ccb from "./ccb";

type Input = {
    name: keyof ccb.CreateArgs,
    el: HTMLInputElement | HTMLTextAreaElement,
    test?: (s: string) => boolean,
    hint?: string,
    stringify?: (v: unknown) => string,
    parse?: (s: string) => unknown,
};

export type Upsert = (args: ccb.CreateArgs) => void;

let dialog: HTMLDialogElement;
let form: HTMLFormElement;

let parse = (s: string): unknown => {
    // parse liberally: don't throw, return null instead
    try { return JSON.parse(s); } catch {}
};

let inputs: Input[] = [
    {
        name: "group",
        el: document.createElement("input"),
        test: s => ccb.isGroup(parse(s)),
        hint: "Expected a JSON array of strings",
        stringify: JSON.stringify,
        parse,
    }, {
        name: "name",
        el: document.createElement("input"),
        test: s => s !== "",
        hint: "Required",
    }, {
        name: "command",
        el: document.createElement("input"),
    }, {
        name: "code",
        el: document.createElement("textarea"),
    },
];

let dom = () => {
    dialog = document.createElement("dialog");
    form = document.createElement("form");
    dialog.append(form);

    inputs.forEach(input => {
        let label = document.createElement("label");
        label.append(input.name, input.el);
        input.el.addEventListener("input", () => input.el.setCustomValidity(""));
        form.append(label, document.createElement("br"));
    });

    let cancel = document.createElement("button");
    cancel.type = "button"; // prevent submit
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", () => dialog.close());

    let save = document.createElement("button");
    save.textContent = "Save";

    form.append(cancel, save);

    dialog.addEventListener("close", () => {
        form.reset();
        inputs.forEach(input => input.el.setCustomValidity(""));
    });
};

export let init = (upsert: Upsert): HTMLDialogElement => {
    dom();

    form.addEventListener("submit", ev => {
        ev.preventDefault();

        let invalid = inputs.find(input => input.test && !input.test(input.el.value));
        if (invalid) {
            invalid.el.setCustomValidity(invalid.hint ?? "Invalid value");
            invalid.el.reportValidity();
            return;
        }

        let args = Object.fromEntries(inputs.map(input => [
            input.name,
            input.parse?.(input.el.value) ?? input.el.value
        ])) as ccb.CreateArgs;

        upsert(args);
        dialog.close();
    });

    return dialog;
};

export let up = (args: Partial<ccb.CreateArgs>) => {
    inputs.forEach(i => i.el.value = i.stringify?.(args[i.name]) ?? String(args[i.name] ?? ""));
    dialog.showModal();
};