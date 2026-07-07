// TODO: implement CCB policies, group and global
import { createTable, getCoreRowModel, ExpandedState, getExpandedRowModel, TableState } from "@tanstack/table-core";

type Node = { name: string, children: Node[] };

type Group = any;

let data: Node[] = [{ name: "root", children: [] }];
let expanded: ExpandedState = { "0": true };

let siblings = (path: string[]): Node[] => path.reduce((acc, curr) => {
    let n = acc.find(n => n.name === curr);
    if (!n) {
        n = { name: curr, children: [] };
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

export let setup = (el: HTMLElement) => {
    host = el;
    render();
};

export let create = (msg: any) => {
    let leaf = { name: msg.name, children: [] };
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
        {
            accessorKey: "name",
            header: "Name",
        }
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
            td.style.paddingLeft = `${r.depth * 16}px`;

            if (i === 0 && r.getCanExpand()) {
                let btn = document.createElement("button");
                btn.textContent = r.getIsExpanded() ? "-" : "+";
                btn.onclick = () => {
                    r.toggleExpanded();
                    render();
                };
                td.append(btn, document.createTextNode(" "));
            }

            td.append(String(c.getValue() ?? ""));
            tr.append(td);
        });

        tbody.append(tr);
    });

    troot.append(thead, tbody);
    host.append(troot);
};