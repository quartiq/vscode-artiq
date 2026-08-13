import * as permission from "./applets/permission";
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

let setVisible = (args: any, visible: boolean) => {
    let leafs = permission.leafsByPolicy("visible", args.group, args.name);
    manager.setVisibleAll(leafs, visible);
    layout.updateVisibility(leafs);
};

ccb.handleFuncs({

    create_applet: async args => {
        if (!permission.granted("create", args.group, args.name)) return;

        let fetched = await template.fetch(args.command);
        if (!fetched) return;

        let leaf = manager.create(args.group, args.name);
        if (permission.granted("visible", args.group, args.name))
            manager.setVisible(leaf, true);

        let [ applet, gridDefaults ] = fetched;
        let host = await layout.newTemplateItem(leaf, gridDefaults);

        schedule.setup(args.group, args.name, applet, host);
    },

    restart_applet: args => setVisible(args, true),
    disable_applet: args => setVisible(args, false),

    // legacy alias for calling disable_applet with name === null
    disable_applet_group: args => setVisible({ ...args, name: null }, false),
});

ccb.listen();