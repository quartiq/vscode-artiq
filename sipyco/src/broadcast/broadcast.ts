import * as pyon from "../pyon/pyon.js";
import * as proxy from "../proxy.js";

// see: https://git.m-labs.hk/M-Labs/artiq/src/branch/master/doc/manual/default_network_ports.rst
const port = 1067;

export let subscribe = (params: {
    masterHostname: string,
    targetName: string,
    onReceive: (msg: any) => void,
    onError?: (err: string) => void,

}) => {
    let chan = proxy.chan(params.masterHostname, port, "broadcast", params.targetName);
    chan.addEventListener("message", ev => params.onReceive(pyon.decode(ev.data)));

    chan.addEventListener("close", ev => {
        // see: https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
        let statusInternalError = 1011;
        if (ev.code !== statusInternalError) return;
        params.onError?.(ev.reason);
    });
};