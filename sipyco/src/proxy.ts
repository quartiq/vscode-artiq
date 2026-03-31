let proxyPort = 1071; // FIXME: standardize this port via ARTIQ repo

export let chan = (host: string, port: number, banner: string, target: string) => {
    let ws = new WebSocket(`ws://${host}:${proxyPort}/proxy/${host}:${port}`);

    ws.addEventListener("open", () => {
        // see: https://git.m-labs.hk/M-Labs/sipyco/src/branch/master/sipyco/sync_struct.py
        // and: https://git.m-labs.hk/M-Labs/sipyco/src/branch/master/sipyco/pc_rpc.py
        ws.send(`ARTIQ ${banner}\n`);
        ws.send(`${target}\n`);
    });

    return ws;
};