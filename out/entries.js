import * as utils from "./utils.js";
import * as editors from "./editors.js";
import * as scaneditor from "./scaneditor.js";
let NumberEntry = {
    formatter: (state) => state.toString(),
    editor: (info) => {
        let parse = (el) => Number(el.value);
        let el = editors.input({ ...info, parse });
        el.setAttribute("type", "text");
        el.setAttribute("max", String(info.arg[0].max));
        el.setAttribute("min", String(info.arg[0].min));
        el.setAttribute("step", String(info.arg[0].step));
        // TODO: add unit suffix and scaling, see datasets:applyScale()
        return el;
    },
    getDefault: (procdesc) => procdesc.default ?? 0,
};
let StringEntry = {
    formatter: (state) => state,
    editor: (info) => {
        let parse = (el) => el.value;
        let el = editors.input({ ...info, parse });
        el.setAttribute("type", "text");
        return el;
    },
    getDefault: (procdesc) => procdesc.default ?? "",
};
let DatetimeEntry = {
    formatter: (state) => (new Date(state * 1000)).toLocaleString(),
    editor: (info) => {
        let parse = (el) => {
            let d = new Date(el.value);
            let v = isNaN(d.getTime()) ? utils.nowsecs() : utils.unixsecs(d);
            return v;
        };
        let el = editors.input({ ...info, parse });
        el.setAttribute("type", "datetime-local");
        el.value = utils.datetimelocal(info.arg[3]);
        return el;
    },
    getDefault: (procdesc) => Number(procdesc.default) ?? utils.nowsecs(),
};
let BooleanEntry = {
    formatter: (state) => state ? "\u2714" : "\u2718",
    editor: (info) => {
        let parse = (el) => el.checked;
        let el = editors.input({ ...info, parse });
        el.setAttribute("type", "checkbox");
        el.checked = info.arg[3];
        return el;
    },
    getDefault: (procdesc) => procdesc.default ?? false,
};
let EnumerationEntry = {
    formatter: (state) => state,
    editor: (info) => {
        if (info.arg[0]?.quickstyle) {
            return editors.buttons(info);
        }
        return editors.select(info);
    },
    getDefault: (procdesc) => procdesc.default ?? procdesc.choices[0],
};
let ScanEntry = {
    formatter: (state) => {
        let props = Object.entries(state[state.selected])
            .filter(([k, v]) => k !== "ty")
            .map(([k, v]) => `${k}: ${v}`).join(", ");
        return `[${state.selected}] ${props}`;
    },
    editor: (info) => {
        scaneditor.from(info);
        // no-op to satisfy return type (see: tabulator.js Editor)
        return document.createElement("div");
    },
    getDefault: (procdesc) => {
        // see: artiq/gui/entries:ScanEntry.default_state
        const scale = procdesc.scale;
        return {
            selected: "NoScan",
            NoScan: { value: 0, repetitions: 1 },
            RangeScan: { start: 0, stop: 100 * scale, npoints: 10, randomize: false, seed: null },
            CenterScan: { center: 0, span: 100 * scale, step: 10 * scale, randomize: false, seed: null },
            ExplicitScan: { sequence: [] },
            ...Object.fromEntries(procdesc.default.map((o) => [o.ty, o])),
        };
    },
};
let entryMap = {
    NumberValue: NumberEntry,
    PYONValue: StringEntry,
    BooleanValue: BooleanEntry,
    EnumerationValue: EnumerationEntry,
    StringValue: StringEntry,
    UnixtimeValue: DatetimeEntry,
    Scannable: ScanEntry,
};
export let entry = (ty) => entryMap[ty];
//# sourceMappingURL=entries.js.map