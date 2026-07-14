// TODO: implement CCB policies, group and global
import {
    createTable, getCoreRowModel, ExpandedState, getExpandedRowModel, TableState, Row, Cell,
} from "@tanstack/table-core";

import { Name, GroupEl, Group } from "./types";

type Node = { name: Name | GroupEl, visible: boolean, children: Node[] };
type Coord = number | undefined;
type Geometry = { x: Coord, y: Coord, w: Coord, h: Coord };
export type Leaf = Node & { name: Name, group: Group, geometry?: Geometry, children: [] };
let isLeaf = (n: Node): n is Leaf => "group" in n;
type VisibilityHandler = (leafs: Leaf[]) => void;

let data: Node[] = [{ name: "root", visible: true, children: [] }];
let expanded: ExpandedState = { "0": true };
let onVisibilityChanged: VisibilityHandler;

let siblings = (path: Group): [ Node[], boolean ] => path.reduce((acc, curr) => {
    let [ sibs, visible ] = acc;
    let n = sibs.find(n => n.name === curr && !isLeaf(n));
    if (!n) {
        n = { name: curr, visible, children: [] } as Node;
        sibs.push(n);
    }
    return [ n.children, n.visible ];
}, [ data[0].children, data[0].visible ]);

let addNode = (group: Group, leaf: Leaf) => {
    let [ sibs, visible ] = siblings(group);
    if (sibs.some(n => n.name === leaf.name && isLeaf(n))) return;
    sibs.push({ ...leaf, visible });
};

let host: HTMLElement;

export let setup = (args: { host: HTMLElement, handler: VisibilityHandler }) => {
    host = args.host;
    onVisibilityChanged = args.handler;
    render();
};

let find = (group: Group, name: Name): Leaf | undefined => {
    let [ sibs ] = siblings(group);
    return sibs.find(n => n.name === name && isLeaf(n)) as Leaf | undefined;
};

// FIXME: msg is of type CCBMessage<"create_applet">
export let create = (msg: any): Leaf => {
    let leaf = find(msg.group, msg.name);
    if (!leaf) {
        leaf = { name: msg.name, group: msg.group, visible: true, children: [] };
        addNode(msg.group, leaf);
    }

    render();
    return leaf;
};

let state: TableState = {
    columnVisibility: {},
    columnOrder: [],
    columnPinning: { left: [], right: [] },
    rowPinning: { top: [], bottom: [] },
    columnFilters: [],
    globalFilter: undefined,
    sorting: [],
    expanded,
    grouping: [],
    columnSizing: {},
    columnSizingInfo: {
        startOffset: null,
        startSize: null,
        deltaOffset: null,
        deltaPercentage: null,
        isResizingColumn: false,
        columnSizingStart: [],
    },
    pagination: {
        pageIndex: 0,
        pageSize: 10,
    },
    rowSelection: {},
};

let table = () => createTable<Node>({
    data,
    columns: [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "visible", header: "👁️" },
    ],
    state,
    onStateChange: updater => {
        state = typeof updater === "function" ? updater(state) : updater;
        expanded = state.expanded;
        render();
    },
    renderFallbackValue: null,
    getSubRows: r => r.children,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
});

let setVisible = (n: Node, visible: boolean): void => {
    n.visible = visible;
    n.children.forEach(c => setVisible(c, visible));
};

let leafs = (n: Node): Leaf[] => {
    if (isLeaf(n)) return [ n ];

    let all: Leaf[] = [];
    let collect = (n: Node) => n.children.forEach(c => isLeaf(c) ? all.push(c) : collect(c));
    collect(n);
    return all;
};

let cellHandlers = [
    (td: HTMLTableCellElement, r: Row<Node>, c: Cell<Node, unknown>) => {
        if (r.getCanExpand()) {
            let btn = document.createElement("span");
            btn.textContent = r.getIsExpanded() ? "👇" : "👉";
            btn.addEventListener("click", () => {
                r.toggleExpanded();
                render();
            });
            td.append(btn);
        }

        td.style.paddingLeft = `${r.depth * 16}px`;
        td.append(String(c.getValue() ?? ""));
    },

    (td: HTMLTableCellElement, r: Row<Node>, c: Cell<Node, unknown>) => {
        let input = document.createElement("input");
        input.type = "checkbox";
        input.checked = Boolean(c.getValue());
        input.addEventListener("change", () => {
            setVisible(r.original, input.checked);
            onVisibilityChanged(leafs(r.original));
            render();
        });

        td.append(input);
    },
];

let render = () => {
    let t = table();

    host.innerHTML = "";

    let troot = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    let hr = document.createElement("tr");
    t.getFlatHeaders().forEach(h => {
        let th = document.createElement("th");
        th.textContent = String(h.column.columnDef.header ?? "");
        hr.append(th);
    });
    thead.append(hr);

    t.getRowModel().rows.forEach(r => {
        let tr = document.createElement("tr");

        r.getVisibleCells().forEach((c, i) => {
            let td = document.createElement("td");
            cellHandlers[i](td, r, c);
            tr.append(td);
        });

        tbody.append(tr);
    });

    troot.append(thead, tbody);
    host.append(troot);
};