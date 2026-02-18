// see: m-labs/sipyco/pyon:_encode_nparray()
import ndarray, { NdArray } from "ndarray";
import isTypedArray from "is-typed-array";
import { flatten } from "flat";

import * as dtype from "./dtype.js";
import * as utils from "../utils.js";

type Params = [shape: number[], dtype: string, data: string];
type ParamsHuman = [shape: number[], dtype: string, data: any[]];

// TODO: Do not error on unknown data types, be liberal
export let fromMachine = (params: any[]): NdArray => {
    let TypedArray = dtype.from(params[1]);
    let buffer = utils.bytesFrom(params[2]).buffer as ArrayBuffer;
    return ndarray((new TypedArray(buffer) as any), params[0]);
};

export let toMachine = (data: any): Params => {
    let arr = data as NdArray;
    if (!isTypedArray(arr.data)) { throw new Error(`Invalid datatype: ${arr.data.constructor.name}`); }

    let base64 = utils.base64From(new Uint8Array(arr.data.buffer));
    return [ arr.shape ?? [], dtype.toString((arr.data.constructor as any))!, base64 ];
};

// humans can not edit base64 data which
// justifies this additional conversion
export let fromHuman = (params: any[]): NdArray => {
    let TypedArray = dtype.from(params[1]);
    let arr = flatten(params[2]);
    return ndarray(new TypedArray(arr as any), params[0]) as NdArray<any>;
};

let unpack = (arr: NdArray): any => {
    if (arr.shape.length === 0) {
        return (arr.data as any)[arr.offset];
    }

    let result = [];
    for (let i = 0; i < arr.shape[0]; i++) {
        if (arr.shape.length === 1) {
            result.push((arr.data as any)[arr.offset + i * arr.stride[0]]);
            continue;
        }

        result.push(unpack(ndarray(
            arr.data,
            arr.shape.slice(1),
            arr.stride.slice(1),
            arr.offset + i * arr.stride[0]
        )));
    }

    return result;
};

export let toHuman = (data: any): ParamsHuman => {
    let arr = data as NdArray;
    return [ arr.shape, dtype.toString(arr.data.constructor as any)!, unpack(arr) ];
};

export let forPreview = (data: any): any => unpack(data as NdArray);

export let copy = (src: any): any => ndarray(
    ((src as NdArray).data as any).slice(),
    (src as NdArray).shape.slice(),
    (src as NdArray).stride.slice(),
    (src as NdArray).offset,
);

// TODO: support tuple indices like [1, [2, 3]] and such
export let get = (tagged: any, key: any): any => (tagged as NdArray).pick(key);
export let set = (tagged: any, key: any, value: any) => (tagged as NdArray).set(key, value);