import * as argument from "./argument.js";
import * as utils from "./utils.js";
import * as editors from "./editors.js";
import * as scan from "./scan.js";

type Entry<P extends argument.Procdesc> = {
    formatter: (state: argument.State<P>) => string,
    editor: editors.Editor<P>,
    getDefault: (procdesc: P) => argument.State<P>,
};

let NumberEntry: Entry<argument.Number> = {
    formatter: (state: argument.State<argument.Number>) => state.toString(),

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
    formatter: (state: argument.State<argument.String>) => state as string,

    editor: (args: editors.Args<argument.String>): HTMLElement => {
        let parse = (el: HTMLElement): string => (el as HTMLInputElement).value;
        let el = editors.input({ ...args, parse });
        el.setAttribute("type", "text");
        return el;
    },

    getDefault: (procdesc: argument.PYON | argument.String): string => procdesc.default ?? "",
};

let DatetimeEntry: Entry<argument.Unixtime> = {
    formatter: (state: argument.State<argument.Unixtime>) => (new Date((state as number) * 1000)).toLocaleString(),

    editor: (args: editors.Args<argument.Unixtime>): HTMLElement => {
        let parse = (el: HTMLElement): number => {
            let d = new Date((el as HTMLInputElement).value);
            let v = isNaN(d.getTime()) ? utils.nowsecs() : utils.unixsecs(d);
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
    formatter: (state: argument.State<argument.Boolean>) => state ? "\u2714" : "\u2718",

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
    formatter: (state: argument.State<argument.Enum>) => state,

    editor: (args: editors.Args<argument.Enum>): HTMLElement => {
        if (args.procdesc?.quickstyle) { return editors.buttons(args); }
        return editors.select(args);
    },

    getDefault: (procdesc: argument.Enum): string => procdesc.default ?? procdesc.choices[0],
};

let ScanEntry: Entry<argument.Scannable> = {
    formatter: (state: scan.ScanState) => JSON.stringify(state),

    editor: (args: editors.Args<argument.Scannable>): HTMLElement => {
        // TODO: create lovely graphical editor like in artiq_dashboard
        let parse = (el: HTMLElement): scan.ScanState => JSON.parse((el as HTMLInputElement).value);
        let el = editors.scan({ ...args, parse });
        el.setAttribute("type", "text");
        return el;
    },

    getDefault: (procdesc: argument.Scannable): scan.ScanState => {
        // see: artiq/gui/entries:ScanEntry.default_state
        const scale = procdesc.scale;
        return {
            selected: "NoScan",
            NoScan: { value: 0, repetitions: 1 },
            RangeScan: { start: 0, stop: 100 * scale, npoints: 10, randomize: false, seed: undefined },
            CenterScan: { center: 0, span: 100 * scale, step: 10 * scale, randomize: false, seed: undefined },
            ExplicitScan: { sequence: [] },

            ...Object.fromEntries(procdesc.default.map((o: scan.ScanObject) => [o.ty, o])),
        };
    },
};

let entryMap: Record<argument.Ty, Entry<any>> = {
    NumberValue: NumberEntry,
    PYONValue: StringEntry,
    BooleanValue: BooleanEntry,
    EnumerationValue: EnumerationEntry,
    StringValue: StringEntry,
    UnixtimeValue: DatetimeEntry,
    Scannable: ScanEntry,
};

export let entry = (ty: argument.Ty): Entry<any> => entryMap[ty];