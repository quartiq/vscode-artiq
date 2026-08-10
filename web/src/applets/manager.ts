import {
    createTable, getCoreRowModel, ExpandedState, getExpandedRowModel, TableState, Row, Cell,
} from "@tanstack/table-core";

import { Name, GroupEl, Group } from "./ccb";

type PolicyName = "create" | "visible";
let policies = [ undefined, true, false ]; // undefined represents policy inheritance from parent
type Policy = typeof policies[number];

type Node = {
    name: Name | GroupEl,
    visible: boolean,
    policy: Record<PolicyName, Policy>,
    children: Node[],
};

type Root = Node & {
    name: "root",
    visible: true,
    policy: { create: true, visible: false },
};

type Coord = number | undefined;
type Geometry = { x: Coord, y: Coord, w: Coord, h: Coord };
export type Leaf = Node & { name: Name, group: Group, geometry?: Geometry, children: [] };
let isLeaf = (n: Node): n is Leaf => "group" in n;
type Handler = (leafs: Leaf[]) => void;
type Handlers = {
    onVisibilityChanged: Handler,
    onDelete: Handler,
};

let root: Root = { name: "root", visible: true, policy: { create: true, visible: false }, children: [] };
let data: Node[] = [ root ];
let expanded: ExpandedState = { "0": true };
let handlers: Handlers;

let host: HTMLElement;

export let setup = (args: { host: HTMLElement, handlers: Handlers }) => {
    host = args.host;
    handlers = args.handlers;
    render();
};

type Step<T> = (n: Node | undefined, acc: T) => T;

let walk = <T>(path: Group, seed: T, step: Step<T>, create?: boolean): T => path
    .reduce(([ sibs, visible, acc ], name): [ Node[], boolean, T ] => {
        let group = sibs.find(n => n.name === name && !isLeaf(n));
        if (create && !group)
            sibs.push(group = { name, visible, policy: { create: undefined, visible: undefined }, children: [] });

        return [ group?.children ?? [], group?.visible ?? visible, step(group, acc) ];
    }, [root.children, root.visible, seed])[2];

let pave = <T>(path: Group, seed: T, step: (n: Node, acc: T) => T): T => walk(path, seed, step as Step<T>, true);

let findLeaf = (path: Group, name: Name): Leaf | undefined =>
    walk(path, root.children, n => n ? n.children : [])
        .find(n => n.name === name && isLeaf(n)) as Leaf | undefined;

let inherited = (name: PolicyName, path: Group): boolean =>
    walk(path, root.policy[name], (n, acc) => n?.policy[name] ?? acc);

let newLeaf = (path: Group, name: Name): Leaf => {
    let [ sibs, visible ] = pave(path, [ root.children, root.visible ], n => [ n.children, n.visible ]);
    let leaf: Leaf = { name, group: path, visible, policy: { create: undefined, visible: undefined }, children: [] };
    sibs.push(leaf);
    return leaf;
};

// FIXME: msg is of type ccb.Message<"create_applet">
export let create = (msg: any): Leaf | undefined => {
    let leaf = findLeaf(msg.group, msg.name);

    let granted = leaf?.policy.create ?? inherited("create", msg.group);
    if (!granted) return undefined;

    if (!leaf) leaf = newLeaf(msg.group, msg.name);

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

let parent = (node: Node): Node | undefined => {
    let find = (curr: Node): Node | undefined => {
        if (curr.children.includes(node)) return curr;
        return curr.children.map(child => find(child)).find(n => n !== undefined);
    };

    return find(root);
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
            handlers.onVisibilityChanged(leafs(r.original));
            render();
        });

        td.append(input);
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
        let after = (p: Policy): Policy => policies[ (policies.indexOf(p) + 1) % policies.length];

        let input = document.createElement("input");
        input.type = "checkbox";
        updateCheckbox(c.getValue() as Policy);

        input.addEventListener("change", () => {
            let next = after(c.getValue() as Policy);
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