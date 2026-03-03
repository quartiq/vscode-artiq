import * as vscode from "vscode";
import net from "net";
import { once } from "events";
import * as pyon from "./pyon/pyon.js";
const host = vscode.workspace.getConfiguration("artiq").get("host");
export let receiver = (port, banner, target) => {
    // TODO: use "readline" module wrapper, make "parseLine(s)" save to use
    let client = new net.Socket();
    client.connect(port, host, () => {
        client.write("ARTIQ " + banner + "\n");
        client.write(target + "\n");
    });
    client.on("connectionAttemptFailed", () => vscode.window.showErrorMessage("Connection error. Is ARTIQ server running?"));
    return client;
};
// TODO: use kwargs instead of args, less ugly
export let rpc = async (target, method, args, kwargs, debug) => {
    let client = new net.Socket();
    client.connect(3251, host);
    await once(client, "connect");
    client.write("ARTIQ pc_rpc\n");
    let response = parseLine((await once(client, "data"))[0]);
    if (!response.targets.includes(target)) {
        vscode.window.showErrorMessage("RPC target not found. Custom port in use?");
        return undefined;
    }
    if (!response.features.includes("pyon_v2")) {
        vscode.window.showErrorMessage("PYON v2 not supported. ARTIQ update may help.");
        return undefined;
    }
    if (debug === "targets") {
        vscode.window.showErrorMessage(`RPC Targets: ${JSON.stringify(response)}`);
        return undefined;
    }
    client.write(target + " pyon_v2\n");
    response = parseLine((await once(client, "data"))[0]);
    if (debug === "methods") {
        vscode.window.showErrorMessage(`RPC Methods: ${JSON.stringify(response)}`);
        return undefined;
    }
    client.write(pyon.encode({
        action: "call",
        name: method,
        args: args,
        kwargs: kwargs ?? {},
    }) + "\n");
    let result = parseLine((await once(client, "data"))[0]);
    if (result.status === "failed") {
        vscode.window.showErrorMessage(`RPC failed: ${JSON.stringify(result.exception)}`);
        return undefined;
    }
    return result;
};
let parseLine = (bytes) => pyon.decode(bytes.toString());
export let parseLines = (bytes) => bytes.toString().trim().split("\n")
    .map((s) => pyon.decode(s));
//# sourceMappingURL=net.js.map