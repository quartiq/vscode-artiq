// see sequence.plantuml

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

    fmt: (params: Params) => string, // considers params as leaf in the hint tree
    parse: (formatted: string) => any, // any := TypeTaggedObject
}

// TODO: implement missing types
import * as set from "./set";
import * as dict from "./dict";
import * as tuple from "./tuple";
import * as nparray from "./nparray";
const types: Record<string, Type> = { set, dict, tuple, nparray };

// JSONClassHint -> TypeTaggedObject
export let decode = (hinted: string): any => JSON.parse(hinted, (k: string, v: any): any => {
    if (!isJsonClassHint(v)) { return v; }

    let type;
    try {
        type = types[v[marker][0]];
        if (type === undefined) {
            throw new Error(`PYON type not yet implemented: ${v[marker][0]}`);
        }
    } catch (err) {
        console.error(err);
    }

    let revived = type?.revive(v[marker][1]);
    revived[marker] = v[marker][0];
    return revived as TypeTaggedObject;
});

// TypeTaggedObject -> JSONClassHint
export let encode = (tagged: any): string => JSON.stringify(tagged, (k: string, v: any): any => {
    if (!isTypeTaggedObject(v)) { return v; }

    let params = types[v[marker]].replace(v);
    let replaced: Record<string, any> = {};
    replaced[marker] = [ v[marker], params ];
    return replaced as JsonClassHint;
});

// TypeTaggedObject -> "pyon.<typename>(<formatted value>)"
export let fmt = (tagged: any): string => {
    // go back to JsonClassHint first, because there is no room
    // for recursion moving along a tree root to leaf (JSON.stringify)
    // while handing over pretty printed strings
    let hinted = encode(tagged);

    return JSON.parse(hinted, (k: string, v: any): any => {
        if (!isJsonClassHint(v)) { return v; }

        // JSON.parse moves leaf to root, so let's gooo!
        let t = v[marker][0];
        return `pyon.${t}(${types[t].fmt(v)})`;
    });
};

// "pyon.<typename>(<formatted value>)" -> TypeTaggedObject
// TODO: regarding recursion this is
// incomplete and very hard to get right
export let parse = (s: string): TypeTaggedObject | string => {
    let match = s.match(/^pyon\.(\w+)\s*\((.*)\)$/);
    if (!match) { return s; }

    let [_, name, formatted] = match;
    if (!types[name]) { return s; }

    let parsed = types[name].parse(formatted);
    parsed[marker] = name;
    return parsed as TypeTaggedObject;
};