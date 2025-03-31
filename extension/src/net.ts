import * as vscode from "vscode";
let net = require("net");

const host = vscode.workspace.getConfiguration("artiq").get("host");

export let logger = () => {
    let client = new net.Socket();

    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L347-L348
    client.connect(1067, host, () => {
        client.write("ARTIQ broadcast\n");
        client.write("log\n");
    });

    client.on("connectionAttemptFailed", () => vscode.window.showErrorMessage("Connection error. Is ARTIQ server running?"));
    return client;
};