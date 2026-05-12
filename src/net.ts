import * as vscode from "vscode";
import net from "net";
import * as pyon from "sipyco/pyon";

export type Bytes = {type: "Buffer", data: number[]};

const host: string = vscode.workspace.getConfiguration("artiq").get("host")!;

export let receiver = (port: number, banner: string, target: string) => {
    // TODO: use "readline" module wrapper, make "parseLine(s)" save to use
    let client = new net.Socket();

    client.connect(port, host, () => {
        client.write("ARTIQ " + banner + "\n");
        client.write(target + "\n");
    });

    client.on("connectionAttemptFailed", () => vscode.window.showErrorMessage("Connection error. Is ARTIQ server running?"));
    return client;
};

export let parseLines = (bytes: Bytes) => bytes.toString().trim().split("\n")
    .map((s: string) => pyon.decode(s));