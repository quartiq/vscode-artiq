import * as views from "../views.js";
import * as net from "../net.js";
import * as syncstruct from "../syncstruct.js";
import * as pyon from "../pyon/pyon.js";
export let view;
export let init = async (context) => {
    view = new views.ArtiqViewProvider("schedule", context.extensionUri, {
        rpc: (data) => {
            net.rpc("schedule", data.method, [data.rid]);
        },
    });
    view.set("Waiting for connection ...");
    syncstruct.from({
        channel: "schedule",
        onReady: () => view.init(),
        onReceive: (struct) => view.post(pyon.encode(struct.data)),
    });
};
//# sourceMappingURL=schedule.js.map