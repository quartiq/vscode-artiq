// TODO: unify experiments and arguments
import * as tabulator from "tabulator-tables";

import * as argument from "../argument.js";
import * as entries from "../entries.js";
import * as experiment from "../experiment.js";
import * as utils from "../utils.js";
import { Message } from "../views/experiment.js";

const vscode = acquireVsCodeApi();

let table: tabulator.TabulatorFull;

let idleel = document.querySelector(".idle")!;
let msgels = idleel.querySelectorAll(".msg");
let tableel = document.querySelector(".table")!;

type Info = experiment.SchedulerInfo & experiment.LogLevel;
type RowInfo<K extends keyof Info> = argument.RowInfo<argument.Procdesc> & {
    name: K,
    arg: argument.Argument<argument.Procdesc, Info[K]>,
};

type Field = {
    key: keyof Info,
    procdesc: argument.Procdesc,
}

let fields: Record<string, Field> = {
    "Priority": { key: "priority", procdesc: { ty: "StringValue" } as argument.String },
    "Log level": { key: "log_level", procdesc: { ty: "EnumerationValue", choices: Object.keys(utils.logging) } as argument.Enum },
    "Pipeline": { key: "pipeline_name", procdesc: { ty: "StringValue" } as argument.String },
    "Due date": { key: "due_date", procdesc: { ty: "UnixtimeValue" } as argument.Unixtime },
    "Flush": { key: "flush", procdesc: { ty: "BooleanValue" } as argument.Boolean },
};

let accessor: tabulator.CustomAccessor = (arg: argument.Argument<argument.Procdesc>) => arg[3];

let formatter: tabulator.Formatter = cell => {
    let row = cell.getRow().getData() as RowInfo<keyof Info>;
    return entries.entry(row.arg[0].ty)?.formatter(row.arg[3]);
};

let editor: tabulator.Editor = (cell, onRendered, success, cancel) => {
    let row = cell.getRow().getData() as RowInfo<keyof Info>;
    return entries.entry(row.arg[0].ty)?.editor({
        arg: row.arg,
        post: vscode.postMessage,
        cell, onRendered, success, cancel,
    });
};

let cellEdited: tabulator.CellEditEventCallback = cell => {
    let row = cell.getRow().getData() as RowInfo<keyof Info>;
    console.log(row);
    vscode.postMessage({
        action: "change", data: {
            key: fields[row.name].key,
            value: row.arg[3],
        },
    });
};

let mutator: tabulator.CustomMutator = (value, data) => data.name === "Due date" && value === null ? utils.nowsecs() : value;

let updateTable = (exp: experiment.DbInfo) => {
    let data = Object.entries(fields)
        .map(([name, field]) => ({ name, arg: [ field.procdesc, "", "", exp[field.key] ] })) as RowInfo<keyof Info>[];

    table?.destroy?.();
    table = new tabulator.TabulatorFull(".table", {
        headerVisible: false,
        layout: "fitDataFill",
        data,
        columns: [
            { title: "Name", field: "name" },
            { title: "State", field: "arg", accessor, formatter, editor, cellEdited, mutator },
        ],
    });
};

type Action = (msg: Message) => void;
let actions: Record<string, Action> = {
    update: (msg: Message) => {
        if (!msg.selectedClass) {
            showIdle("select");
            return;
        }

        if (!msg.exp && msg.inRepo) {
            showIdle("scan");
            return;
        }

        if (!msg.exp) {
            showIdle("examine");
            return;
        }

        updateTable(msg.exp);
        idleel.classList.add("hidden");
        tableel.classList.remove("hidden");
    }
};

let showIdle = (type: "select" | "scan" | "examine") => {
    msgels.forEach(el => el.classList.add("hidden"));
    idleel.querySelector(`.msg.${type}`)!.classList.remove("hidden");

    idleel.classList.remove("hidden");
    tableel.classList.add("hidden");
};

window.addEventListener("message", ev => actions[ev.data.action](ev.data.data));