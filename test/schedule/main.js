let net = require("net");
let {once} = require("events");

let foo = async () => {
    let client = new net.Socket();
    client.connect(3251, "::1");

    await once(client, "connect");
    console.log("connected");

    client.write("ARTIQ pc_rpc\n");
    let r = await once(client, "data");
    console.log(r.toString());

    client.end();
};

foo();
console.log("end");
