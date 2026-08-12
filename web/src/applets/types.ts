import { Group, Name } from "./ccb";

// TODO: maybe move towards dbio?

type Key = [ Group, Name ];
export type KeyString = string;

export let keystr = ([ group, name ]: Key): KeyString => JSON.stringify([ group, name ]);
let key = (s: KeyString): Key => JSON.parse(s) as Key;