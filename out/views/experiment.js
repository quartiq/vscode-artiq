import * as views from "../views.js";
import * as experiment from "../experiment.js";
import * as hostutils from "../coreutils.js";
export let view;
export let init = async (context) => {
    view = new views.ArtiqViewProvider("experiment", context.extensionUri, {
        change: async (data) => {
            let exp = await experiment.curr();
            if (!exp) {
                return;
            }
            exp[data.key] = data.value;
            experiment.updateDb(exp);
        },
    });
    view.init();
};
export let update = async () => {
    let selectedClass = await hostutils.selectedClass();
    let exp = await experiment.curr();
    let inRepo = exp ? experiment.inRepo(exp) : false;
    view.post({ action: "update", data: { selectedClass, inRepo, exp } });
};
//# sourceMappingURL=experiment.js.map