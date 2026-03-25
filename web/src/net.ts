import * as pyon from "../../sipyco/src/pyon/pyon";
//import * as syncstruct from "syncstruct";

const uri = document.location.href
    .replace(/^http/, "ws")
    .replace(/(.*\/).*/, "$1proxy/");

//export let syncstructFrom = (channel: string, handle: syncstruct.UpdateHandler):  => {
export let syncstructFrom = (channel: string, handle: Function) => {
    // see: https://git.m-labs.hk/M-Labs/artiq/src/branch/master/doc/manual/default_network_ports.rst
    let addr = "localhost:3250"
    let ws = new WebSocket(uri + addr);
//    let store = syncstruct.createStore();

    ws.addEventListener("open", () => {
        // see: https://git.m-labs.hk/M-Labs/sipyco/src/branch/master/sipyco/sync_struct.py
        ws.send("ARTIQ sync_struct\n");
        ws.send(channel + "\n");
    });

    ws.addEventListener("message", ev => {
        let mods = pyon.decode(ev.data);
        console.log(mods);
        //syncstruct.update(store, mods, handle);
    });

    //return store;
};