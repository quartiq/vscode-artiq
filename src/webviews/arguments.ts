import * as tabulator from "tabulator-tables";

import * as argument from "../argument.js";
import * as entries from "../entries.js";

const vscode = acquireVsCodeApi();

let table: tabulator.TabulatorFull;

let idleel = document.querySelector(".idle")!;
let tableel = document.querySelector(".table")!;

let formatter: tabulator.Formatter = cell => {
    let row = cell.getRow().getData() as argument.RowInfo<argument.Procdesc>;
    return entries.entry(row.arg[0].ty)?.formatter(row.arg[3]);
};

let editor: tabulator.Editor = (cell, onRendered, success, cancel) => {
    let row = cell.getRow().getData() as argument.RowInfo<argument.Procdesc>;
    return entries.entry(row.arg[0].ty)?.editor({
        arg: row.arg,
        post: vscode.postMessage,
        cell, onRendered, success, cancel,
    });
};

let cellEdited: tabulator.CellEditEventCallback = cell => {
    let row = cell.getRow().getData() as argument.RowInfo<argument.Procdesc>;
    vscode.postMessage({
        action: "change", data: row,
    });
};

let updateTable = (data: argument.RowInfo<argument.Procdesc>[]) => {
    table?.destroy?.();
    table = new tabulator.TabulatorFull(".table", {
        headerVisible: false,
        layout: "fitDataFill",
        data,
        groupBy: "group",
        groupHeader: value => value ?? "",
        columns: [
            { title: "Name", field: "name" },
            { title: "State", field: "arg[3]", formatter, editor, cellEdited },
        ],
        columnDefaults: { tooltip: (ev, cell) => cell.getRow().getData().tooltip },
    });
};

type Action = (msg: argument.RowInfo<argument.Procdesc>[]) => void;
let actions: Record<string, Action> = {
    update: msg => {
        if (!msg.length) {
            idleel.classList.remove("hidden");
            tableel.classList.add("hidden");
            return;
        }

        updateTable(msg);
        idleel.classList.add("hidden");
        tableel.classList.remove("hidden");
    },
};

window.addEventListener("message", ev => actions[ev.data.action](ev.data.data));