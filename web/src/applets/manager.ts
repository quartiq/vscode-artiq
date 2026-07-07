// TODO: implement CCB policies, group and global
import {
    createTable, getCoreRowModel, ExpandedState, getExpandedRowModel, TableState, Row, Cell,
} from "@tanstack/table-core";
import { GridStack } from "gridstack";

import { findWidgetElement } from "./utils";

type Node = { name: string, visible: boolean, children: Node[] };

type Group = any;

let data: Node[] = [{ name: "root", visible: true, children: [] }];
let expanded: ExpandedState = { "0": true };

let siblings = (path: string[]): Node[] => path.reduce((acc, curr) => {
    let n = acc.find(n => n.name === curr);
    if (!n) {
        n = { name: curr, visible: true, children: [] };
        acc.push(n);
    }
    return n.children;
}, data[0].children);

let addNode = (group: Group, leaf: Node) => {
    if (!group) group = [];
    if (typeof group === "string") group = [ group ];
    let s = siblings(group);

    if (s.some(n => n.name === leaf.name)) return;
    s.push(leaf);
};

let host: HTMLElement;
let grid: GridStack;

export let setup = (_host: HTMLElement, _grid: GridStack) => {
    host = _host;
    grid = _grid;
    render();
};

export let create = (msg: any) => {
    let leaf = { name: msg.name, visible: true, children: [] };
    addNode(msg.group, leaf);
    render();
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

let setVisible = (node: Node, visible: boolean) => {
    node.visible = visible;
    node.children.forEach(child => setVisible(child, visible));

    let wel = findWidgetElement(node.name, grid);
    if (!wel) return;

    let reveal = () => {
        grid.makeWidget(wel);
        wel.classList.remove("hidden");
    };

    let hide = () => {
        grid.removeWidget(wel, false);
        wel.classList.add("hidden");
    };

    visible ? reveal() : hide();
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