const marker = "__jsonclass__"; // see: m-labs/sipyco/pyon
type Params = any[];
type JsonClassHint = { [ marker ]: [ constructor: string, params: Params ] }; // see: https://www.jsonrpc.org/specification_v1#a3.JSONClasshinting
let isJsonClassHint = (v: any): boolean => {
    if (typeof v !== "object") { return false; }
    if (v === null) { return false; }

    let keys = Object.keys(v);
    return keys.length === 1 && keys[0] === marker;
};

// we use a marker key to tag type info, because
// instanceof or constructor.name may be lost
// by operations like structuredClone() in the meantime
type TypeTaggedObject = { [ marker ]: string };
export let isTypeTaggedObject = (v: any): boolean => {
    if (typeof v !== "object") { return false; }
    if (v === null) { return false; }
    
    return v.hasOwnProperty(marker);
};

interface Type {
    revive: (params: Params) => any, // any := TypeTaggedObject
    replace: (data: TypeTaggedObject) => Params,

    fmt: (data: TypeTaggedObject) => string,
    parse: (formatted: string) => any, // any := TypeTaggedObject
}

// TODO: implement missing types
import * as set from "./set";
import * as tuple from "./tuple";
import * as nparray from "./nparray";
const types: Record<string, Type> = { set, tuple, nparray };

export let decode = (s: string) => JSON.parse(s, (k: string, v: any): any => {
    if (!isJsonClassHint(v)) { return v; }

    let revived = types[v[marker][0]]?.revive(v[marker][1]);
    revived[marker] = v[marker][0];
    return revived as TypeTaggedObject;
});

export let encode = (v: any) => JSON.stringify(v, (k: string, v: any): any => {
    if (!isTypeTaggedObject(v)) { return v; }

    let params = types[v[marker]].replace(v);
    let replaced: Record<string, any> = {};
    replaced[marker] = [ v[marker], params ];
    return replaced as JsonClassHint;
});

// format: pyon.<typename>(<formatted value>)
export let fmt = (data: TypeTaggedObject): string => `pyon.${data[marker]}(${types[data[marker]].fmt(data)})`;
export let parse = (s: string): TypeTaggedObject | string => {
    let match = s.match(/^pyon\.(\w+)\s*\((.*)\)$/);
    if (!match) { return s; }

    let [_, name, formatted] = match;
    if (!types[name]) { return s; }

    let parsed = types[name].parse(formatted);
    parsed[marker] = name;
    return parsed as TypeTaggedObject;
};