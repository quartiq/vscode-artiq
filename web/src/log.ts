import * as broadcast from "sipyco/broadcast";

broadcast.subscribe({
    masterHostname: "localhost",
    targetName: "log",
    onReceive: record => console.log(record),
    onError: err => console.error("Connection error. Is ARTIQ server running?", err),
});