import { GridStack, GridStackWidget, GridItemHTMLElement } from "gridstack";
import { LeafNode } from "./tree";
import { KeyString, keystr } from "./types";
import { Group, Name } from "./ccb";

let grid: GridStack;
export let init = () => grid = GridStack.init({ handle: ".widget-header" });

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

export let updateVisibility = (leafs: LeafNode[]) => {
    let tuples = leafs
        // insert new widgets bottom-right first, top-left last
        // don't push residing widgets all the way down
        .sort((a, b) => (b.geometry?.y ?? 0) - (a.geometry?.y ?? 0)
            || (b.geometry?.x ?? 0) - (a.geometry?.x ?? 0))
        .map((l): [ GridItemHTMLElement | undefined, LeafNode ] => [ findItem(keystr([ l.group, l.name ]), grid), l ])
        .filter((t): t is [ GridItemHTMLElement, LeafNode ] => t[0] !== undefined);

    tuples.forEach(([ item, l ]) => cacheGeometry(item, l));
    tuples.forEach(([ item, l ]) => syncVis(item, l, grid));
};

export let remove = (group: Group, name: Name) => {
    let item = findItem(keystr([ group, name ]), grid);
    if (!item) return;
    grid.removeWidget(item);
};

export let newManagerItem = () => {
    let item = newItem("🛠️ Manage Applets");
    activateItem("manager", item, grid, { w: 9, h: 3});

    return item.querySelector(".widget-body") as HTMLElement;
};

export let newTemplateItem = async (leaf: LeafNode, defaults: GridStackWidget | undefined): Promise<HTMLElement> => {
    // what "args" may consist of:
    // { name: "code_applet_example", command: "code_applet_dataset", code: 'from PyQt6 import QtWidgets\n\nfrom artiq.applets.simple import SimpleApplet\n\n\nclass DemoWidget(QtWidgets.QLabel):\n    def __init__(self, args, ctl):\n        QtWidgets.QLabel.__init__(self)\n        self.dataset_name = args.dataset\n\n    def data_changed(self, value, metadata, persist, mods):\n        try:\n            n = str(value[self.dataset_name])\n        except (KeyError, ValueError, TypeError):\n            n = "---"\n        n = "<font size=15>" + n + "</font>"\n        self.setText(n)\n\n\ndef main():\n    applet = SimpleApplet(DemoWidget)\n    applet.add_dataset("dataset", "dataset to show")\n    applet.run()\n\nif __name__ == "__main__":\n    main()\n', group: "autoapplet" }
    // { name: "flopping_f", command: "${artiq_applet}plot_xy flopping_f_brightness --x flopping_f_frequency --fit flopping_f_fit" }

    let keystring = keystr([ leaf.group, leaf.name ]);
    let item = findItem(keystring, grid);
    if (!item) {
        let breadcrumb = [ ...leaf.group, leaf.name ].reverse().join(" — ");
        item = newItem(breadcrumb, "applet");
        activateItem(keystring, item, grid, defaults ?? { w: 5, h: 4 });
    }

    let host = item.querySelector(".widget-body") as HTMLElement;
    host.innerHTML = "";

    cacheGeometry(item, leaf);
    syncVis(item, leaf, grid);
    return host;
};