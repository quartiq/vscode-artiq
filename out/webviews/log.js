import * as tabulator from "tabulator-tables";
let table = new tabulator.Tabulator(".table", {
    layout: "fitDataFill",
    columns: [
        { title: "Level", field: "level" },
        { title: "Source", field: "source" },
        { title: "Time", field: "time" },
        { title: "Message", field: "message" },
    ],
});
window.addEventListener("message", ev => {
    ev.data.forEach((record) => {
        table.addRow({
            level: record[0],
            source: record[1],
            time: record[2],
            message: record[3],
        }, true);
    });
});
//# sourceMappingURL=log.js.map