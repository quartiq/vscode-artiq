import * as vscode from "vscode";
let net = require("net");

const host = vscode.workspace.getConfiguration("artiq").get("host");

let dial = (port: Number, banner: string, target: string) => {
    let client = new net.Socket();

    client.connect(port, host, () => {
        client.write(banner);
        client.write(target);
    });

    client.on("connectionAttemptFailed", () => vscode.window.showErrorMessage("Connection error. Is ARTIQ server running?"));
    return client;
};

// see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L347-L348
export let r_log = () => dial(1067, "ARTIQ broadcast\n", "log\n");

// see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L336
export let r_schedule = () => dial(3250, "ARTIQ sync_struct\n", "schedule\n");

// see: https://github.com/m-labs/artiq/blob/master/artiq/frontend/artiq_client.py#L381
export let w_schedule = () => dial(3251, "ARTIQ pc_rpc\n", "schedule\n");

export let run = (filepath: string, writer: any) => {
    const WARNING = 30;

    let obj = {
        action: "call",
        name: "submit",

        // see: https://github.com/m-labs/artiq/blob/master/artiq/master/scheduler.py#L436
        args: [
            "main", // pipeline_name
            { // expid
                file: filepath,
                log_level: WARNING,
                class_name: null,
                arguments: {},
            }
        ],
        kwargs: {},
    };

    writer.write(JSON.stringify(obj) + "\n");
    vscode.window.showInformationMessage(`Running experiment: ${filepath}`);
};