import * as argument from "./argument.js";
import * as utils from "./utils.js";
import * as editors from "./editors.js";

type Entry<P extends argument.Procdesc> = {
    editor: editors.Editor<P>,
    // TODO: replace all (project wide) implicit "Function" types with explicit type aliases
    getDefault: Function,
};

export let entry = (ty: argument.Ty) => ({
    NumberValue: NumberEntry,
    PYONValue: StringEntry,
    BooleanValue: BooleanEntry,
    EnumerationValue: EnumerationEntry,
    StringValue: StringEntry,
    UnixtimeValue: DatetimeEntry,
    Scannable: ScanEntry,
})[ty];

let NumberEntry: Entry<argument.Number> = {
    editor: (args: editors.Args<argument.Number>): HTMLElement => {
        let parse = (el: HTMLElement): number => Number((el as HTMLInputElement).value);
        let el = editors.input({ ...args, parse });

        el.setAttribute("type", "text");
        el.setAttribute("max", String(args.procdesc.max));
        el.setAttribute("min", String(args.procdesc.min));
        el.setAttribute("step", String(args.procdesc.step));
        // TODO: add unit suffix and scaling, see datasets:applyScale()
        return el;
    },
    getDefault: (procdesc: argument.Number): number => procdesc.default ?? 0,
};

let StringEntry: Entry<argument.String> = {
    editor: (args: editors.Args<argument.String>): HTMLElement => {
        let parse = (el: HTMLElement): string => (el as HTMLInputElement).value;
        let el = editors.input({ ...args, parse });
        el.setAttribute("type", "text");
        return el;
    },
    getDefault: (procdesc: argument.PYON | argument.String): string => procdesc.default ?? "",
};

let unixsecs = (date: Date): number => Math.floor(date.getTime() / 1000);

let DatetimeEntry: Entry<argument.Unixtime> = {
    editor: (args: editors.Args<argument.Unixtime>): HTMLElement => {
        let parse = (el: HTMLElement): number => {
            let d = new Date((el as HTMLInputElement).value);
            let v = isNaN(d.getTime()) ? utils.nowsecs() : unixsecs(d);
            return v;
        };

        let el = editors.input({ ...args, parse });
        el.setAttribute("type", "datetime-local");
        el.value = utils.datetimelocal(args.cell.getValue());
        return el;
    },
    getDefault: (procdesc: argument.Unixtime): number => Number(procdesc.default) ?? utils.nowsecs(),
};

let BooleanEntry: Entry<argument.Boolean> = {
    editor: (args: editors.Args<argument.Boolean>): HTMLElement => {
        let parse = (el: HTMLElement): boolean => (el as HTMLInputElement).checked;
        let el = editors.input({ ...args, parse });
        el.setAttribute("type", "checkbox");
        el.checked = args.cell.getValue();
        return el;
    },
    getDefault: (procdesc: argument.Boolean): boolean => procdesc.default ?? false,
};

let EnumerationEntry: Entry<argument.Enum> = {
    editor: (args: editors.Args<argument.Enum>): HTMLElement => {
        if (args.procdesc?.quickstyle) { return editors.buttons(args); }
        return editors.select(args);
    },
    getDefault: (procdesc: argument.Enum): string => procdesc.default ?? procdesc.choices[0],
};

let ScanEntry: Entry<argument.Scan> = {
    // TODO: see artiq/gui/entries:ScanEntry.default_state
    editor: (): HTMLElement => document.createElement("div"),
    getDefault: (procdesc: argument.Scan): object => ({}),
};