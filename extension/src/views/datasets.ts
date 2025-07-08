import * as vscode from "vscode";

import * as pyon from "../pyon";
import * as syncstruct from "../syncstruct";

let provider: DatasetsProvider;
let view: vscode.TreeView<string>;
let sets: syncstruct.Struct = {};

let name = (keypath: string) => keypath.split(".").slice(-1)[0];
let startsWith = (arr: string[], prefix: string[]) => arr.slice(0, prefix.length).every((val, index) => val === prefix[index]);
let fmt = (set: pyon.Tuple) => `${set[0] ? "🟢" : "🔴"} ${set[1]}${set[2].unit ? " " + set[2].unit : ""}`;

class DatasetTreeItem extends vscode.TreeItem {
    constructor(
        keypath: string,
    ) {
        super(name(keypath));
        if (sets[keypath]) { this.description = fmt(sets[keypath]); }

        let hasChildren = Object.keys(sets).some(k => k.startsWith(`${keypath}.`));
        if (hasChildren) { this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed; }
    }
}

class DatasetsProvider implements vscode.TreeDataProvider<string> {
    private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
    readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;
    public refresh(keypath: string): void {
        if (keypath) {
            // tree model assumes the existence of an element
            // so we update through "getChildren" on its parent
            keypath = keypath.split(".").slice(0, -1).join(".");
        }
        this._onDidChangeTreeData.fire(keypath);
        vscode.window.showInformationMessage("Updated Datasets");
    }

    constructor() {}

    getTreeItem(keypath: string): vscode.TreeItem {
        return new DatasetTreeItem(keypath);
    }

    async getChildren(keypath?: string): Promise<string[]> {
        let parentKeys = keypath ? keypath.split(".") : [];
        let dup = Object.keys(sets)
            .map(kp => kp.split(".").slice(0, parentKeys.length + 1))
            .filter(keys => startsWith(keys, parentKeys))
            .filter(keys => keys.length > parentKeys.length)
            .map(keys => keys.join("."))
            .sort((a, b) => name(a).localeCompare(name(b)));
        return [...new Set(dup)];
    }
}

export let init = async () => {
    provider = new DatasetsProvider();
    view = vscode.window.createTreeView("datasets", {
        treeDataProvider: provider,
    });

    sets = syncstruct.from({
        channel: "datasets",
        onReceive: keypath => provider.refresh(keypath),
    });
};