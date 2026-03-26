import * as sync_struct from "sipyco/sync_struct";

let store = sync_struct.from({
    masterHostname: "localhost",
    notifierName: "datasets",
    onReceive: store => console.log(store.struct),
    onError: err => console.error("Connection error. Is ARTIQ server running?", err),
});