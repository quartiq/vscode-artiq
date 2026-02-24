import {TabulatorFull as Tabulator} from "tabulator-tables";
import {decode} from "../pyon/pyon.js";
import * as run from "../run.js";

const vscode = acquireVsCodeApi();

type RowInfo = {rid: run.Id} & run.SyncInfo;
let rows: RowInfo[] = [];
type RpcMethod = "request_termination" | "delete";

let rpc = (method: RpcMethod, rid: run.Id) => vscode.postMessage({
    action: "rpc",
    data: {method, rid},
});

let table = new Tabulator(".table", {
    layout:"fitDataFill",
    columns: [
        {title: "RID", field: "rid"},
        {title: "Pipeline", field: "pipeline"},
        {title: "Status", field: "status"},
        {title: "Prio", field: "priority"},
        {title: "Due date", field: "due_date"},
        {title: "Revision", field: "expid.repo_rev", formatter: cell => cell.getValue() ?? "w/o repo"},
        {title: "File", field: "expid.file"},
        {title: "Class name", field: "expid.class_name"},
    ],

    rowContextMenu: [
        {
            label: "Request termination",
            action: (ev, row) => rpc("request_termination", row.getData().rid),
        }, {
            label: "Delete",
            action: (ev, row) => rpc("delete", row.getData().rid),
        }, {
            label: "Gracefully terminate all in pipeline",
            action: (ev, row) => rows
                .filter(r => r.pipeline === row.getData().pipeline)
                .forEach(r => rpc("request_termination", r.rid)),
        },
    ],
});

window.addEventListener("message", ev => {
    rows = decode(ev.data).entries
        .map(([rid, syncinfo]: [run.Id, run.SyncInfo]) => ({ rid, ...syncinfo }));
    table.replaceData(rows);
});