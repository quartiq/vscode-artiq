import {
    createTable, getCoreRowModel, ExpandedState, getExpandedRowModel, TableState, Row, Cell,
} from "@tanstack/table-core";

import { PolicyName, Policy, nextPolicy, Visible, Node, LeafNode, isLeaf, leafFrom, newLeaf, leafs, parent, root } from "./tree";
import { Name, Group, GroupEl } from "./ccb";

type Handler = (leafs: LeafNode[]) => void;
type HandleFuncs = {
    updateVisibility: Handler;
    remove: Handler;
};

let handlers: HandleFuncs;
let host: HTMLElement;

let data: Node[] = [ root ];
let expanded: ExpandedState = { "0": true };

export let handleFuncs = (funcs: HandleFuncs) => handlers = funcs;

export let setup = (el: HTMLElement) => {
    host = el;
    render();
};

export let setVisible = (node: Node, visible: boolean): void => {
    leafs(node).forEach(l => l.visible = visible);
    render();
};


export let create = (group: Group, name: Name): LeafNode => {
    let leaf = leafFrom(group, name) ?? newLeaf(group, name);
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

let agents = {
    human: { icon: "🧑", bg: "mistyrose" }, // invoke UI actions now
    machine: { icon: "🤖", bg: "aliceblue" }, // allow or deny future external CCB actions
};

let table = () => createTable<Node>({
    data,
    columns: [
        { accessorKey: "name", header: "Name" },
        {
            header: agents.human.icon,
            meta: { bg: agents.human.bg },
            columns: [
                { accessorKey: "visible", header: "👁️", meta: { bg: agents.human.bg } },
                { header: "🗑️", meta: { bg: agents.human.bg } },
            ],
        },
        {
            header: agents.machine.icon,
            meta: { bg: agents.machine.bg },
            columns: [
                { accessorFn: row => row.policy?.create, header: "🌱", meta: { bg: agents.machine.bg } },
                { accessorFn: row => row.policy?.visible, header: "👁️", meta: { bg: agents.machine.bg } },
            ],
        },
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

let policyCellHandler = (name: PolicyName, node: Node, p: Policy) => {
    let updateCheckbox = (p: Policy) => {
        input.indeterminate = p === undefined;
        input.checked = p === true;
    };

    let input = document.createElement("input");
    input.type = "checkbox";
    updateCheckbox(p);

    input.addEventListener("change", () => {
        let next = nextPolicy(p);
        if (node === root) next = !p;
        node.policy[name] = next;
        updateCheckbox(next);

        render();
    })

    return input;
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
        td.append(c.getValue() as Name | GroupEl);
    },

    (td: HTMLTableCellElement, r: Row<Node>, c: Cell<Node, unknown>) => {
        if (isLeaf(r.original)) {
            let input = document.createElement("input");
            input.type = "checkbox";
            input.checked = c.getValue() as Visible;

            let leaf = r.original;
            input.addEventListener("change", () => {
                setVisible(leaf, input.checked);
                handlers.updateVisibility([ leaf ]);
                render();
            });

            td.append(input);
            return;
        }

        [ true, false ].forEach(visible => {
            let btn = document.createElement("button");
            btn.innerText = visible ? "🟢" : "🔴";
            btn.addEventListener("click", () => {
                setVisible(r.original, visible);
                handlers.updateVisibility(leafs(r.original));
                render();
            });

            td.append(btn);
        });
    },

    (td: HTMLTableCellElement, r: Row<Node>) => {
        let p = parent(r.original);
        if (!p) return;

        let btn = document.createElement("button");
        btn.innerText = "❌";
        btn.addEventListener("click", () => {
            let i = p.children.indexOf(r.original);
            if (i === -1) return;

            p.children.splice(i, 1);
            handlers.remove(leafs(r.original));
            render();
        });

        td.append(btn);
    },

    (td: HTMLTableCellElement, r: Row<Node>, c: Cell<Node, unknown>) => {
        let input = policyCellHandler("create", r.original, c.getValue() as Policy);
        td.append(input);
    },

    (td: HTMLTableCellElement, r: Row<Node>, c: Cell<Node, unknown>) => {
        let input = policyCellHandler("visible", r.original, c.getValue() as Policy);
        td.append(input);
    },
];

let render = () => {
    let t = table();

    host.innerHTML = "";

    let troot = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    t.getHeaderGroups().forEach(hg => {
        let hr = document.createElement("tr");
        hg.headers.forEach(h => {
            let th = document.createElement("th");
            let meta = h.column.columnDef.meta as { bg?: string } | undefined;
            th.style.backgroundColor = meta?.bg ?? "";
            th.colSpan = h.colSpan;
            if (!h.isPlaceholder) th.textContent = String(h.column.columnDef.header ?? "");
            hr.append(th);
        });
        thead.append(hr);
    });

    t.getRowModel().rows.forEach(r => {
        let tr = document.createElement("tr");

        r.getVisibleCells().forEach((c, i) => {
            let td = document.createElement("td");
            let meta = c.column.columnDef.meta as { bg?: string } | undefined;
            td.style.backgroundColor = meta?.bg ?? "";
            cellHandlers[i](td, r, c);
            tr.append(td);
        });

        tbody.append(tr);
    });

    troot.append(thead, tbody);
    host.append(troot);
};