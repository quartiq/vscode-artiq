import {TabulatorFull as Tabulator} from "tabulator-tables";

import {entry} from "../entries.js";
const vscode = acquireVsCodeApi();
let table: Tabulator;

let formatter = (cell, formatterParams, onRendered) => {
    let procdesc = cell.getRow().getData().procdesc;
    return entry(procdesc.ty)?.formatter(cell.getRow().getData().state);
};

let editor = (cell, onRendered, success, cancel) => {
    let raw = cell.getRow().getData();
    return entry(raw.procdesc.ty)?.editor({
        arg: [ raw.procdesc, raw.group, raw.tooltip, raw.state ],
        post: vscode.postMessage,
        cell, onRendered, success, cancel,
    });
};

let cellEdited = cell => {
    let raw = cell.getRow().getData();
    vscode.postMessage({
        action: "change", data: {
            name: raw.name,
            arg: [ raw.procdesc, raw.group, raw.tooltip, raw.state ],
        },
    });
};

let updateTable = arginfo => {
    let data = Object.entries(arginfo)
        .map(([name, arg]) => ({ name, procdesc: arg[0], group: arg[1], tooltip: arg[2], state: arg[3] }));

    table?.destroy?.();
    table = new Tabulator(".table", {
        headerVisible: false,
        layout: "fitDataFill",
        data,
        groupBy: "group",
        groupHeader: value => value ?? "",
        columns: [
            { field: "name" },
            { field: "state", formatter, editor, cellEdited },
        ],
        columnDefaults: { tooltip: (ev, cell) => cell.getRow().getData().tooltip },
    });
};

let idleel = document.querySelector(".idle");
let tableel = document.querySelector(".table");

let actions = {
    update: data => {
        if (!data.arginfo) {
            idleel.classList.remove("hidden");
            tableel.classList.add("hidden");
            return;
        }

        updateTable(data.arginfo);
        idleel.classList.add("hidden");
        tableel.classList.remove("hidden");
    },
};

window.addEventListener("message", ev => actions[ev.data.action](ev.data.data));