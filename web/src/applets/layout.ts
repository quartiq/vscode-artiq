import { GridStack, GridStackWidget, GridItemHTMLElement } from "gridstack";
import { LeafNode } from "./tree";
import * as manager from "./manager";
import * as template from "./template";
import { Applet, KeyString, keystr } from "./types";
import { KwargTypes } from "./ccb";

let newItem = (title: string, className?: string): GridItemHTMLElement => {
    let item = document.createElement("div");
    item.classList.add("grid-stack-item");
    if (className) item.classList.add(className);

    let content = document.createElement("div");
    content.classList.add("grid-stack-item-content");

    let header = document.createElement("div");
    header.classList.add("widget-header");
    header.innerText = title;

    let body = document.createElement("div");
    body.classList.add("widget-body");

    content.append(header, body);
    item.append(content);
    return item;
};

let activateItem = (id: string, item: GridItemHTMLElement, grid: GridStack, defaults: GridStackWidget) => {
    grid.el.append(item);

    // need to do it this way opposed to .addWidget()
    // to register drag area via "handle" option during init, further down
    grid.makeWidget(item, { id, ...defaults });
};

let findItem = (keystring: KeyString, grid: GridStack): GridItemHTMLElement | undefined => {
    // can not make use of Utils.find() since it holds stale DOM references during drag
    let el = grid.el.querySelector(`[gs-id="${CSS.escape(keystring)}"]`);
    return el as GridItemHTMLElement | undefined;
};

let cacheGeometry = (item: GridItemHTMLElement, l: LeafNode) => {
    if (item.gridstackNode === undefined) return;
    let { x, y, w, h } = item.gridstackNode;
    l.geometry = { x, y, w, h };
};

let revealItem = (item: GridItemHTMLElement, l: LeafNode, grid: GridStack) => {
    let id = keystr([ l.group, l.name ]);
    grid.makeWidget(item, { id, ...l.geometry});
    item.classList.remove("hidden");
};

let hideItem = (item: GridItemHTMLElement, grid: GridStack) => {
    grid.removeWidget(item, false);
    item.classList.add("hidden");
};

let syncVis = (item: GridItemHTMLElement, leaf: LeafNode, grid: GridStack) => {
    if (leaf.visible && item.classList.contains("hidden")) {
        revealItem(item, leaf, grid);
        return;
    }

    if (!leaf.visible && !item.classList.contains("hidden")) {
        hideItem(item, grid);
    }
};

export let newManagerItem = (grid: GridStack, onDelete: (leafs: LeafNode[]) => void) => {
    let item = newItem("🛠️ Manage Applets");
    activateItem("manager", item, grid, { w: 9, h: 3});

    let handlers = {

        onVisibilityChanged: (leafs: LeafNode[]) => {
            let tuples = leafs
                // insert new widgets bottom-right first, top-left last
                // don't push residing widgets all the way down
                .sort((a, b) => (b.geometry?.y ?? 0) - (a.geometry?.y ?? 0)
                    || (b.geometry?.x ?? 0) - (a.geometry?.x ?? 0))
                .map((l): [ GridItemHTMLElement | undefined, LeafNode ] => [ findItem(keystr([ l.group, l.name ]), grid), l ])
                .filter((t): t is [ GridItemHTMLElement, LeafNode ] => t[0] !== undefined);

            tuples.forEach(([ item, l ]) => cacheGeometry(item, l));
            tuples.forEach(([ item, l ]) => syncVis(item, l, grid));
        },

        onDelete: (leafs: LeafNode[]) => {
            leafs
                .map(l => findItem(keystr([ l.group, l.name ]), grid))
                .filter(item => item !== undefined)
                .forEach(item => grid.removeWidget(item));

            onDelete(leafs);
        },
    };

    let host = item.querySelector(".widget-body") as HTMLElement;
    manager.setup({ host, handlers });
};

type TemplateItem = { keystring: KeyString, applet: Applet, host: HTMLElement };

export let newTemplateItem = async (args: KwargTypes["create_applet"], leaf: LeafNode, grid: GridStack): Promise<TemplateItem | undefined> => {
    // what "args" may consist of:
    // { name: "code_applet_example", command: "code_applet_dataset", code: 'from PyQt6 import QtWidgets\n\nfrom artiq.applets.simple import SimpleApplet\n\n\nclass DemoWidget(QtWidgets.QLabel):\n    def __init__(self, args, ctl):\n        QtWidgets.QLabel.__init__(self)\n        self.dataset_name = args.dataset\n\n    def data_changed(self, value, metadata, persist, mods):\n        try:\n            n = str(value[self.dataset_name])\n        except (KeyError, ValueError, TypeError):\n            n = "---"\n        n = "<font size=15>" + n + "</font>"\n        self.setText(n)\n\n\ndef main():\n    applet = SimpleApplet(DemoWidget)\n    applet.add_dataset("dataset", "dataset to show")\n    applet.run()\n\nif __name__ == "__main__":\n    main()\n', group: "autoapplet" }
    // { name: "flopping_f", command: "${artiq_applet}plot_xy flopping_f_brightness --x flopping_f_frequency --fit flopping_f_fit" }

    let applet = await template.fetch(args.command);
    if (!applet) return undefined;

    // TODO: check leaf.policy.visible, if applet can be set to visible on creation or not

    let keystring = keystr([ args.group, args.name ]);
    let item = findItem(keystring, grid);
    if (!item) {
        let breadcrumb = [ ...args.group, args.name ].reverse().join(" — ");
        item = newItem(breadcrumb, "applet");
        activateItem(keystring, item, grid, applet.gridDefaults ?? { w: 5, h: 4 });
    }

    let host = item.querySelector(".widget-body") as HTMLElement;
    host.innerHTML = "";

    cacheGeometry(item, leaf);
    syncVis(item, leaf, grid);
    return { keystring, applet, host };
};