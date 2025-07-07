const marker = "__jsonclass__";

export let decode = (s: string) => JSON.parse(s, reviver);
export let encode = (v: any) => JSON.stringify(v, replacer);

let reviver = (k: string, v: any) => {
    if (typeof v !== "object") { return v; }
    if (v === null) { return v; }

    let [meta, ok] = metaclassFrom(v);
    if (!ok) { return v; }

    if (meta[0] === "tuple") { return Tuple.from(meta[1][0]); }
    // TODO: implement other custom pyon type
    return `${meta[0]}: unknown pyon type, check pyon module`;
};

let replacer = (k: string, v: any) => {
    // TODO: implement
    return v;
};

type Metaclass = [string, any[]]; // [constructor, params], see: https://www.jsonrpc.org/specification_v1#a3.JSONClasshinting

let metaclassFrom = (value: Record<string, any>): [Metaclass, boolean] => {
    let keys = Object.keys(value);
    let ok = keys.length === 1 && keys[0] === marker;
    return [value[marker], ok];
};

export class Tuple extends Array {}