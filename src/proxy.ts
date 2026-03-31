import * as net from "node:net";
import { WebSocketServer } from "ws";

let port = 1071; // FIXME: standardize proxy port via ARTIQ repo
let wss = new WebSocketServer({ port });

wss.on("connection", (ws, req) => {
    if (!req.url) {
        ws.close();
        return;
    }

    let [host, port] = req.url?.slice("/proxy/".length).split(":"); // FIXME: does not support IPv6
    let tcp = net.connect({ host, port: Number(port) });

    ws.on("message", data => {
        tcp.write(data.toString());
    });

    let buf = "";
    tcp.on("data", chunk => {
        buf += chunk.toString("utf8");
        let i: number;

        while ((i = buf.indexOf("\n")) !== -1) {
            ws.send(buf.slice(0, i + 1));
            buf = buf.slice(i + 1);
        }
    });

    ws.on("close", () => tcp.destroy());
    tcp.on("close", () => ws.close());
    ws.on("error", () => tcp.destroy());
    tcp.on("error", () => ws.close());
});