import * as dbio from "./dbio";
import * as utils from "./utils.js"; // FIXME: why is this only working with .js suffix?
import * as editors from "./editors.js";

type Entry<P extends dbio.Procdesc> = {
    editor: editors.Editor<P>,
    // TODO: replace all (project wide) implicit "Function" types with explicit type aliases
    getDefault: Function,
};

export let entry = (ty: string) => ({
    NumberValue: NumberEntry,
    PYONValue: StringEntry,
    BooleanValue: BooleanEntry,
    EnumerationValue: EnumerationEntry,
    StringValue: StringEntry,
    UnixtimeValue: DatetimeEntry,
    Scannable: ScanEntry,
})[ty];

let NumberEntry: Entry<dbio.Number> = {
    editor: (args: editors.Args<dbio.Number>): HTMLElement => {
        let parse = (el: HTMLElement): number => Number((el as HTMLInputElement).value);
        let el = editors.input({ ...args, parse });

        el.setAttribute("type", "text");
        el.setAttribute("max", String(args.procdesc.max));
        el.setAttribute("min", String(args.procdesc.min));
        el.setAttribute("step", String(args.procdesc.step));
        // TODO: add unit suffix and scaling, see datasets:applyScale()
        return el;
    },
    getDefault: (procdesc: dbio.Number): number => procdesc.default ?? 0,
};

let StringEntry: Entry<dbio.String> = {
    editor: (args: editors.Args<dbio.String>): HTMLElement => {
        let parse = (el: HTMLElement): string => (el as HTMLInputElement).value;
        let el = editors.input({ ...args, parse });
        el.setAttribute("type", "text");
        return el;
    },
    getDefault: (procdesc: dbio.PYON | dbio.String): string => procdesc.default ?? "",
};

let unixsecs = (date: Date): number => Math.floor(date.getTime() / 1000);

let DatetimeEntry: Entry<dbio.Unixtime> = {
    editor: (args: editors.Args<dbio.Unixtime>): HTMLElement => {
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
    getDefault: (procdesc: dbio.Unixtime): number => Number(procdesc.default) ?? utils.nowsecs(),
};

let BooleanEntry: Entry<dbio.Boolean> = {
    editor: (args: editors.Args<dbio.Boolean>): HTMLElement => {
        let parse = (el: HTMLElement): boolean => (el as HTMLInputElement).checked;
        let el = editors.input({ ...args, parse });
        el.setAttribute("type", "checkbox");
        el.checked = args.cell.getValue();
        return el;
    },
    getDefault: (procdesc: dbio.Boolean): boolean => procdesc.default ?? false,
};

let EnumerationEntry: Entry<dbio.Enum> = {
    editor: (args: editors.Args<dbio.Enum>): HTMLElement => {
        if (args.procdesc?.quickstyle) { return editors.buttons(args); }
        return editors.select(args);
    },
    getDefault: (procdesc: dbio.Enum): string => procdesc.default ?? procdesc.choices[0],
};

let ScanEntry: Entry<dbio.Scan> = {
    // TODO: see artiq/gui/entries:ScanEntry.default_state
    editor: (): HTMLElement => document.createElement("div"),
    getDefault: (procdesc: dbio.Scan): object => ({}),
};