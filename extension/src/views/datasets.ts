import * as vscode from "vscode";

import * as net from "../net";
import * as pyon from "../pyon";
import * as syncstruct from "../syncstruct";

let provider: DatasetsProvider;
export let view: vscode.TreeView<string>;

type Set = [persist: boolean, value: any, metadata: { unit: string, scale: Number, precision: Number }];
let sets: Record<string, Set> = {};
let leafpaths: { [name: string]: any[] } = {
    Value: [1],
    Unit: [2, "unit"],
    Scale: [2, "scale"],
    Precision: [2, "precision"],
};

let name = (keypath: string): string => keypath.split(".").pop()!;

// makes no implicit statement regarding overflow one way or the other
let startsWith = (arr: string[], prefix: string[]) => arr
    .slice(0, prefix.length)
    .every((val, index) => val === prefix[index]);

let findChildren = (keypaths: string[], prefix: string[], depth?: number): string[][] => keypaths
    .map(kp => kp.split("."))
    .filter(keys => startsWith(keys, prefix))
    .filter(keys => keys.length >= prefix.length + (depth ?? 0));

let isNode = (keypath: string): boolean => findChildren(Object.keys(sets), keypath.split(".")).length > 0;

let closestParent = (keypath: string | undefined): string | undefined => {
    if (!keypath || Object.keys(sets).length === 0) { return undefined; }

    let target = keypath.split(".");
    while (true) {
        target.pop();
        let related = findChildren(Object.keys(sets), target);
        if (related.length > 0) { break; }
    }

    return target.join(".");
};

// TODO: this should be created according to m-labs/artiq/dashboard/datasets:77
let fmt = (set: pyon.Tuple) => `${set[1]}${set[2].unit ? " " + set[2].unit : ""}`;

class DatasetTreeItem extends vscode.TreeItem {
    constructor(
        keypath: string,
    ) {
        super(name(keypath));

        let set = sets[keypath];
        if (set) {
            this.description = fmt(set);
            this.contextValue = "dataset";
            this.checkboxState = Number(set[0]);
            this.tooltip = "Checkbox: Make dataset persist ARTIQ restart";
        }

        if (isNode(keypath)) {
            this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            return;
        }

        // only value and metadata nodes left at this point
        set = sets[keypath.split(".").slice(0, -1).join(".")];
        this.description = String(leafpaths[name(keypath)].reduce((acc, key) => acc[key], set));
        let color = new vscode.ThemeColor("symbolIcon.variableForeground");
        this.iconPath = new vscode.ThemeIcon("edit", color);
    }
}


class DatasetsProvider implements vscode.TreeDataProvider<string> {
    private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
    public refresh(keypath: string | undefined): void {
        // tree model assumes the existence of a node, so
        // we update through "getChildren" on closest existing parent node
        this._onDidChangeTreeData.fire(closestParent(keypath));
        vscode.window.showInformationMessage("Updated Datasets");
    }

    constructor() { }

    getTreeItem(keypath: string): vscode.TreeItem {
        return new DatasetTreeItem(keypath);
    }

    getParent(keypath: string): string {
        return keypath.split(".").slice(0, -1).join(".");
    }

    async getChildren(keypath?: string): Promise<string[]> {
        let parentKeys = keypath ? keypath.split(".") : [];
        let dups = findChildren(Object.keys(sets), parentKeys, 1)
            .map(keys => keys.slice(0, parentKeys.length + 1).join("."))
            .sort((a, b) => name(a).localeCompare(name(b)));

        let leafs: string[] = [];
        if (keypath && keypath in sets) {
            leafs = Object.keys(leafpaths).map(name => [keypath, name].join("."));
        }

        // create Set() instance to erase duplicates
        // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
        return [...leafs, ...new Set(dups)];
    }
}

export let init = async () => {
    provider = new DatasetsProvider();
    view = vscode.window.createTreeView("datasets", {
        treeDataProvider: provider,
    });

    view.onDidChangeCheckboxState(ev => ev.items.forEach(item => {
        let [keypath, checked] = item;
        let set = sets[keypath];
        net.rpc("dataset_db", "set", [keypath, set[1], Boolean(checked), set[2]]);
    }));

    sets = syncstruct.from({
        channel: "datasets",
        onReceive: mod => {
            provider.refresh(mod.key);
            if (mod.action === "setitem") {
                view.reveal(mod.key, {focus: true, expand: true});
            }
        },
    });
};

export let create = async () => {
    let path = await vscode.window.showInputBox({ prompt: "Path:" });
    if (path) { console.log(await net.rpc("dataset_db", "set", [path, , , ])); }
};

export let move = async (keypath: string) => {
    let newPath = await vscode.window.showInputBox({ prompt: "New path:", value: keypath });
    if (newPath && newPath !== keypath) {
        let set = sets[keypath];
        net.rpc("dataset_db", "delete", [keypath]);
        // unfortunately the interfaces of m-labs/artiq/master/databases:DatasetDB.set()
        // and the underlying data model differ in field order
        // and as they are external interfaces, they can never be changed
        net.rpc("dataset_db", "set", [newPath, set[1], set[0], set[2]]);
    }
};