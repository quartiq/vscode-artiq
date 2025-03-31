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

export let run = (filepath: string) => {
    const WARNING = 30;

    let obj = {
        action: "call",
        name: "submit",

        // see: https://github.com/m-labs/artiq/blob/master/artiq/master/scheduler.py#L436
        args: [
            "main", // pipeline_name
            { // expid
                file: filepath,
                "log_level": WARNING,
                "class_name": null,
                "arguments": {},
            }
        ],
        kwargs: {},
    };

    let client = new net.Socket();

    // see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L381
    client.connect(3251, host, () => {
        client.write("ARTIQ pc_rpc\n");
        client.write("schedule\n");
        client.write(JSON.stringify(obj) + "\n");
    });

    vscode.window.showInformationMessage(`Running experiment: ${filepath}`);
};