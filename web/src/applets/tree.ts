import { Name, GroupEl, Group } from "./ccb";

type PolicyName = "create" | "visible";
let policies = [ undefined, true, false ]; // undefined represents policy inheritance from parent
export type Policy = typeof policies[number];
type DefinitePolicy = boolean;

export let nextPolicy = (p: Policy): Policy => policies[ (policies.indexOf(p) + 1) % policies.length];

type Coord = number | undefined;
// FIXME: this is derived from GridStack
type Geometry = { x: Coord, y: Coord, w: Coord, h: Coord };

export type Node = {
    name: Name | GroupEl,
    policy: Record<PolicyName, Policy>,
    children: Node[],
};

export type RootNode = Node & {
    name: "root",
    policy: { create: true, visible: false },
};

type GroupNode = Node & {
    name: GroupEl,
};

export type LeafNode = Node & {
    name: Name,
    group: Group,
    visible: boolean,
    geometry?: Geometry,
    children: [];
};

export let isLeaf = (n: Node): n is LeafNode => "group" in n;

type WalkStep<T> = (n: Node | undefined, acc: T) => T;

let walk = <T>(path: Group, step: WalkStep<T>, seed: T, create?: boolean): T => path
    .reduce(([ sibs, acc ], name): [ Node[], T ] => {
        let group: GroupNode | undefined = sibs.find((n: Node) => n.name === name && !isLeaf(n));
        if (create && !group)
            sibs.push(group = { name, policy: { create: undefined, visible: undefined }, children: [] });

        return [ group?.children ?? [], step(group, acc) ];
    }, [ root.children, seed ] as [ Node[], T ])[1];

let pave = <T>(path: Group, step: (n: Node, acc: T) => T, seed: T): T => walk(path, step as WalkStep<T>, seed, true);

export let groupFrom = (path: Group): GroupNode | undefined => walk(path, n => n, root);

export let leafFrom = (path: Group, name: Name): LeafNode | undefined => groupFrom(path)?.children
    .find((n): n is LeafNode => n.name === name && isLeaf(n));

export let inherited = (name: PolicyName, path: Group): DefinitePolicy =>
    walk(path, (n, acc) => n?.policy[name] ?? acc, root.policy[name]);

export let newLeaf = (path: Group, name: Name, visible: boolean): LeafNode => {
    let sibs = pave(path, n => n.children, root.children);
    let leaf: LeafNode = { name, group: path, visible, policy: { create: undefined, visible: undefined }, children: [] };
    sibs.push(leaf);
    return leaf;
};

type TraverseStep<T> = (n: Node, acc: T) => T;

let traverse = <T>(node: Node, step: TraverseStep<T>, acc: T): void => {
    let next = step(node, acc);
    node.children.forEach(c => traverse(c, step, next));
};

export let leafs = (node: Node): LeafNode[] => {
    let all: LeafNode[] = [];
    traverse(node, n => isLeaf(n) && all.push(n), undefined);
    return all;
};

export let setVisible = (node: Node, visible: boolean): void => leafs(node).forEach(l => l.visible = visible);

export let setVisibleByPolicy = (node: Node, visible: boolean, fallback: DefinitePolicy): void => traverse(node, (n, inherited) => {
    let granted = n.policy.visible ?? inherited;
    if (granted && isLeaf(n)) n.visible = visible;
    return granted;
}, fallback);

// FIXME: this does not stop traversal on find
export let parent = (node: Node): Node | undefined => {
    let found: Node | undefined;

    traverse<Node | undefined>(root, (curr, p) => {
        if (curr === node) found = p;
        return curr;
    }, undefined);

    return found;
}

export let root: RootNode = { name: "root", policy: { create: true, visible: false }, children: [] };