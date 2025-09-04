import * as dbio from "./dbio";

type Entry = {
    setAttributes?: Function,
    parseInput: Function,
    getDefault: Function,
};

export let entry = (ty: string) => ({
    NumberValue: NumberEntry,
    PYONValue: StringEntry,
    BooleanValue: BooleanEntry,
    EnumerationValue: EnumerationEntry,
    StringValue: StringEntry,
    Scannable: ScanEntry,
})[ty];

let NumberEntry: Entry = {
    setAttributes: (el: HTMLInputElement, procdesc: dbio.Number) => {
        el.setAttribute("type", "text");
        el.setAttribute("max", String(procdesc.max));
        el.setAttribute("min", String(procdesc.min));
        el.setAttribute("step", String(procdesc.step));
        // TODO: add magic
    },
    parseInput: (el: HTMLInputElement): number => Number(el.value),
    getDefault: (procdesc: dbio.Number): number => procdesc.default ?? 0,
};

let StringEntry: Entry = {
    setAttributes: (el: HTMLInputElement) => el.setAttribute("type", "text"),
    parseInput: (el: HTMLInputElement): string => el.value,
    getDefault: (procdesc: dbio.PYON | dbio.String): string => procdesc.default ?? "",
};

let BooleanEntry: Entry = {
    setAttributes: (el: HTMLInputElement, procdesc: dbio.Boolean) => {
        el.setAttribute("type", "checkbox");
        el.checked = procdesc.default;
    },
    parseInput: (el: HTMLInputElement): boolean => el.checked,
    getDefault: (procdesc: dbio.Boolean): boolean => procdesc.default ?? false,
};

let EnumerationEntry: Entry = {
    parseInput: (el: HTMLSelectElement): string => el.value,
    getDefault: (procdesc: dbio.Enum): string => procdesc.default ?? procdesc.choices[0],
};

let ScanEntry: Entry = {
    // TODO: see artiq/gui/entries:ScanEntry.default_state
    parseInput: (el: HTMLElement): object => ({}),
    getDefault: (procdesc: dbio.Scan): object => ({}),
};