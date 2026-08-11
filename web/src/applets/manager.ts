import {
    createTable, getCoreRowModel, ExpandedState, getExpandedRowModel, TableState, Row, Cell,
} from "@tanstack/table-core";

import { Policy, nextPolicy, Node, LeafNode, isLeaf, groupFrom, leafFrom, inherited, newLeaf, leafs, setVisible, setVisibleByPolicy, parent, root } from "./tree";

type Handler = (leafs: LeafNode[]) => void;
type Handlers = {
    onVisibilityChanged: Handler,
    onDelete: Handler,
};

let data: Node[] = [ root ];
let expanded: ExpandedState = { "0": true };
let handlers: Handlers;

let host: HTMLElement;

export let setup = (args: { host: HTMLElement, handlers: Handlers }) => {
    host = args.host;
    handlers = args.handlers;
    render();
};

// FIXME: msg is of type ccb.Message<"create_applet">
export let create = (msg: any): LeafNode | undefined => {
    let leaf = leafFrom(msg.group, msg.name);

    let granted = leaf?.policy.create ?? inherited("create", msg.group);
    if (!granted) return undefined;

    if (!leaf) leaf = newLeaf(msg.group, msg.name, inherited("visible", msg.group));

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
        { header: "🗑️" },
        { accessorFn: row => row.policy?.create, header: "🌱" },
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
        if (isLeaf(r.original)) {
            let input = document.createElement("input");
            input.type = "checkbox";
            input.checked = Boolean(c.getValue());

            let leaf = r.original;
            input.addEventListener("change", () => {
                setVisible(r.original, input.checked);
                handlers.onVisibilityChanged([ leaf ]);
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
                handlers.onVisibilityChanged(leafs(r.original));
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
            handlers.onDelete(leafs(r.original));
            render();
        });

        td.append(btn);
    },

    (td: HTMLTableCellElement, r: Row<Node>, c: Cell<Node, unknown>) => {
        let updateCheckbox = (p: Policy) => {
            input.indeterminate = p === undefined;
            input.checked = p === true;
        };

        let input = document.createElement("input");
        input.type = "checkbox";
        updateCheckbox(c.getValue() as Policy);

        input.addEventListener("change", () => {
            let next = nextPolicy(c.getValue() as Policy);
            if (r.original === root) next = !c.getValue();
            r.original.policy.create = next;
            updateCheckbox(next);

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