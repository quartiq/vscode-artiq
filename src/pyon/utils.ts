import * as pyon from "./pyon.js";

export let validate = (hinted: string, decode: pyon.Decoder): boolean => {
    try {
        decode(hinted);
        return true;
    } catch (e) {
        return false;
    }
};

// FIXME: maybe include "create" in pyon.TypeInterface and implement per type
// because "params" typing could be stronger
export let create = (name: pyon.TypeName, params: any[]): pyon.TypeTaggedObject => {
    let v = pyon.types[name].fromMachine(params);
    v[pyon.marker] = name;
    return v;
};

// FIXME: maybe implement generically and guard against non-indexable types
export let get = (tagged: pyon.TypeTaggedObject, key: any): any =>
    pyon.types[tagged.__jsonclass__].get?.(tagged, key);

export let set = (tagged: pyon.TypeTaggedObject, key: any, value: any) =>
    pyon.types[tagged.__jsonclass__].set?.(tagged, key, value);

export let del = (tagged: pyon.TypeTaggedObject, key: any) =>
    pyon.types[tagged.__jsonclass__].del?.(tagged, key);