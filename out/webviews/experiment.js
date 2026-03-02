// TODO: unify experiments and arguments
import * as tabulator from "tabulator-tables";
import * as utils from "../utils.js";
import * as entries from "../entries.js";
const vscode = acquireVsCodeApi();
let table;
let idleel = document.querySelector(".idle");
let msgels = idleel.querySelectorAll(".msg");
let tableel = document.querySelector(".table");
let fields = {
    "Priority": { key: "priority", procdesc: { ty: "StringValue" } },
    "Log level": { key: "log_level", procdesc: { ty: "EnumerationValue", choices: Object.keys(utils.logging) } },
    "Pipeline": { key: "pipeline_name", procdesc: { ty: "StringValue" } },
    "Due date": { key: "due_date", procdesc: { ty: "UnixtimeValue" } },
    "Flush": { key: "flush", procdesc: { ty: "BooleanValue" } },
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
            key: fields[raw.name].key,
            value: raw.state,
        },
    });
};
let formatter = cell => {
    let data = cell.getRow().getData();
    return entries.entry(data.procdesc.ty)?.formatter(data.state);
};
let mutator = (value, data) => data.name === "Due date" && value === null ? utils.nowsecs() : value;
let updateTable = (exp) => {
    let data = Object.entries(fields)
        .map(([name, field]) => ({ name, procdesc: field.procdesc, state: exp[field.key] }));
    table?.destroy?.();
    table = new tabulator.Tabulator(".table", {
        headerVisible: false,
        layout: "fitDataFill",
        data,
        columns: [
            { title: "Name", field: "name" },
            { title: "State", field: "state", editor, cellEdited, formatter, mutator },
        ],
    });
};
let actions = {
    update: (msg) => {
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
let showIdle = (type) => {
    msgels.forEach(el => el.classList.add("hidden"));
    idleel.querySelector(`.msg.${type}`).classList.remove("hidden");
    idleel.classList.remove("hidden");
    tableel.classList.add("hidden");
};
window.addEventListener("message", ev => actions[ev.data.action](ev.data.data));
//# sourceMappingURL=experiment.js.map