import { PolicyName, DefinitePolicy, Node, LeafNode, isLeaf, walk, traverse, groupFrom, leafFrom, root } from "./tree";
import type * as ccb from "./ccb";

let inherited = (name: PolicyName, path: ccb.Group): DefinitePolicy =>
    walk(path, (n, acc) => n?.policy[name] ?? acc, root.policy[name]);

export let granted = (pname: PolicyName, group: ccb.Group, name: ccb.Name): boolean => {
    let leaf = leafFrom(group, name);
    return leaf?.policy[pname] ?? inherited(pname, group);
};

export let leafsByPolicy = (pname: PolicyName, group: ccb.Group, name: ccb.Name): LeafNode[] => {
    let node: Node | undefined = name === null ? groupFrom(group) : leafFrom(group, name);
    if (!node) return [];

    let all: LeafNode[] = [];

    traverse(node, (n, inherited) => {
        let granted = n.policy[pname] ?? inherited;
        if (granted && isLeaf(n)) all.push(n);
        return granted;
    }, inherited(pname, group));

    return all;
};