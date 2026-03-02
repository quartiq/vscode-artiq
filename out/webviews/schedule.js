import * as tabulator from "tabulator-tables";
import * as pyon from "../pyon/pyon.js";
const vscode = acquireVsCodeApi();
let rows = [];
let rpc = (method, rid) => vscode.postMessage({
    action: "rpc",
    data: { method, rid },
});
let table = new tabulator.Tabulator(".table", {
    layout: "fitDataFill",
    columns: [
        { title: "RID", field: "rid" },
        { title: "Pipeline", field: "pipeline" },
        { title: "Status", field: "status" },
        { title: "Prio", field: "priority" },
        { title: "Due date", field: "due_date" },
        { title: "Revision", field: "expid.repo_rev", formatter: cell => cell.getValue() ?? "w/o repo" },
        { title: "File", field: "expid.file" },
        { title: "Class name", field: "expid.class_name" },
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
    rows = pyon.decode(ev.data).entries
        .map(([rid, syncinfo]) => ({ rid, ...syncinfo }));
    table.replaceData(rows);
});
//# sourceMappingURL=schedule.js.map