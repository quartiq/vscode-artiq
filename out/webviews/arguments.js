import * as tabulator from "tabulator-tables";
import * as entries from "../entries.js";
const vscode = acquireVsCodeApi();
let table;
let formatter = cell => {
    let procdesc = cell.getRow().getData().procdesc;
    return entries.entry(procdesc.ty)?.formatter(cell.getRow().getData().state);
};
let editor = (cell, onRendered, success, cancel) => {
    let raw = cell.getRow().getData();
    return entries.entry(raw.procdesc.ty)?.editor({
        procdesc: raw.procdesc,
        post: vscode.postMessage,
        cell, onRendered, success, cancel,
    });
};
let cellEdited = cell => {
    let raw = cell.getRow().getData();
    vscode.postMessage({
        action: "change", data: {
            name: raw.name,
            arg: [raw.procdesc, raw.group, raw.tooltip, raw.state],
        },
    });
};
let updateTable = (arginfo) => {
    let data = Object.entries(arginfo)
        .map(([name, arg]) => ({ name, procdesc: arg[0], group: arg[1], tooltip: arg[2], state: arg[3] }));
    table?.destroy?.();
    table = new tabulator.Tabulator(".table", {
        headerVisible: false,
        layout: "fitDataFill",
        data,
        groupBy: "group",
        groupHeader: value => value ?? "",
        columns: [
            { title: "Name", field: "name" },
            { title: "State", field: "state", formatter, editor, cellEdited },
        ],
        columnDefaults: { tooltip: (ev, cell) => cell.getRow().getData().tooltip },
    });
};
let idleel = document.querySelector(".idle");
let tableel = document.querySelector(".table");
let actions = {
    update: msg => {
        if (!msg) {
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
//# sourceMappingURL=arguments.js.map