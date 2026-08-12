import * as schedule from "./applets/schedule";
import * as ccb from "./applets/ccb";
import * as layout from "./applets/layout";
import * as manager from "./applets/manager";
import * as template from "./applets/template";

let el = document.createElement("div");
el.classList.add("grid-stack");
document.body.append(el);

layout.init();

manager.handleFuncs({

    updateVisibility: layout.updateVisibility,

    remove: leafs => leafs.forEach(l => {
        layout.remove(l.group, l.name);
        schedule.remove(l.group, l.name);
    }),
});

manager.setup(layout.newManagerItem());

ccb.handleFuncs({

    create_applet: async args => {
        let leaf = manager.create(args.group, args.name);
        if (!leaf) return;

        let fetched = await template.fetch(args.command);
        if (!fetched) return;

        let [ applet, gridDefaults ] = fetched;
        let host = await layout.newTemplateItem(leaf, gridDefaults);
        if (!host) return;

        schedule.setup(args.group, args.name, applet, host);
    },

    restart_applet: args => {
        // TODO
    },

    disable_applet: args => {
        // TODO
    },

    disable_applet_group: args => {
        // legacy alias for calling disable_applet with "name" neglected
        // TODO
    },
});

ccb.listen();