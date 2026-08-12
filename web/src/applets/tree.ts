import { Name, GroupEl, Group } from "./ccb";

export type PolicyName = "create" | "visible";
let policies = [ undefined, true, false ]; // undefined represents policy inheritance from parent
export type Policy = typeof policies[number];
export type DefinitePolicy = boolean;

export let nextPolicy = (p: Policy): Policy => policies[ (policies.indexOf(p) + 1) % policies.length];

type Coord = number | undefined;
// FIXME: this is derived from GridStack
type Geometry = { x: Coord, y: Coord, w: Coord, h: Coord };
export type Visible = boolean;

export type Node = {
    name: Name | GroupEl,
    policy: Record<PolicyName, Policy>,
    children: Node[],
};

type RootNode = Node & {
    name: "root",
    policy: Record<PolicyName, DefinitePolicy>,
};

type GroupNode = Node & {
    name: GroupEl,
};

export type LeafNode = Node & {
    name: Name,
    group: Group,
    visible: Visible,
    geometry?: Geometry,
    children: [];
};

export let isLeaf = (n: Node): n is LeafNode => "group" in n;

type WalkStep<T> = (n: Node | undefined, acc: T) => T;

export let walk = <T>(path: Group, step: WalkStep<T>, seed: T, create?: boolean): T => path
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

export let newLeaf = (path: Group, name: Name): LeafNode => {
    let sibs = pave(path, n => n.children, root.children);
    let leaf: LeafNode = { name, group: path, visible: false, policy: { create: undefined, visible: undefined }, children: [] };
    sibs.push(leaf);
    return leaf;
};

type TraverseStep<T> = (n: Node, acc: T) => T;

export let traverse = <T>(node: Node, step: TraverseStep<T>, acc: T): void => {
    let next = step(node, acc);
    node.children.forEach(c => traverse(c, step, next));
};

export let leafs = (node: Node): LeafNode[] => {
    let all: LeafNode[] = [];
    traverse(node, n => isLeaf(n) && all.push(n), undefined);
    return all;
};

// FIXME: this does not stop traversal on find
export let parent = (node: Node): Node | undefined => {
    let found: Node | undefined;

    traverse<Node | undefined>(root, (curr, p) => {
        if (curr === node) found = p;
        return curr;
    }, undefined);

    return found;
};

export let root: RootNode = { name: "root", policy: { create: true, visible: false }, children: [] };