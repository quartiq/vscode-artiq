const uri = document.location.href
    .replace(/^http/, "ws")
    .replace(/(.*\/).*/, "$1proxy/");

export let chan = (addr: string, banner: string, target: string) => {
    let ws = new WebSocket(uri + addr);

    ws.addEventListener("open", () => {
        // see: https://git.m-labs.hk/M-Labs/sipyco/src/branch/master/sipyco/sync_struct.py
        // and: https://git.m-labs.hk/M-Labs/sipyco/src/branch/master/sipyco/pc_rpc.py
        ws.send(`ARTIQ ${banner}\n`);
        ws.send(`${target}\n`);
    });

    return ws;
};