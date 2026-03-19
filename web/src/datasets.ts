import * as pyon from "../../src/pyon/pyon.ts";

const uri = document.location.href
    .replace(/^http/, "ws")
    .replace(/(.*\/).*/, "$1sipyco");
const sipyco = new WebSocket(uri);

sipyco.addEventListener("message", ev => {
    console.log(pyon.decode(ev.data));
});

sipyco.addEventListener("open", () => {
    // see: https://git.m-labs.hk/M-Labs/artiq/src/branch/master/doc/manual/default_network_ports.rst
    sipyco.send("localhost:3250");
    // see: https://git.m-labs.hk/M-Labs/sipyco/src/branch/master/sipyco/sync_struct.py
    sipyco.send("ARTIQ sync_struct");
    sipyco.send("datasets");
});