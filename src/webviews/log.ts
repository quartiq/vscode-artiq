import {TabulatorFull as Tabulator} from "tabulator-tables";

let table = new Tabulator(".table", {
    layout:"fitDataFill",
    columns: [
        {title: "Level", field: "level"},
        {title: "Source", field: "source"},
        {title: "Time", field: "time"},
        {title: "Message", field: "message"},
    ],
});

// TODO: is this really an array or some pyon type?
type LogInfo = [
    level: number,
    source: string,
    time: number,
    message: string,
];

window.addEventListener("message", ev => {
    ev.data.forEach((record: LogInfo) => {
        table.addRow({
            level: record[0],
            source: record[1],
            time: record[2],
            message: record[3],
        }, true);
    });
});