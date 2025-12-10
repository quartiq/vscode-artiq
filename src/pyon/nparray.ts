// see: m-labs/sipyco/pyon:_encode_nparray()
import ndarray, { NdArray } from "ndarray";
import isTypedArray from "is-typed-array";
import { flatten } from "flat";

import { unpack } from "./ndarray-unpack.js";
import * as utils from "../utils.js";

type Params = [shape: number[], dtype: string, data: string];
type ParamsHuman = [shape: number[], dtype: string, data: any[]];

// Mapping numpy-like dtypes to JS TypedArray subtypes
// see: https://numpy.org/doc/stable/reference/arrays.interface.html#object.__array_interface__
// TODO: implement float16, float128, bUcmOVS and big-endianness
// also check ndarrays internal mapping and package ndarray-complex
type Corresponding = { dtype: string, constructor: any };
let dtypeDict: Corresponding[] = [
    { dtype: "|i1", constructor: Int8Array },
    { dtype: "<i2", constructor: Int16Array },
    { dtype: "<i4", constructor: Int32Array },
    { dtype: "<i8", constructor: BigInt64Array },

    { dtype: "|u1", constructor: Uint8Array },
    { dtype: "<u2", constructor: Uint16Array },
    { dtype: "<u4", constructor: Uint32Array },
    { dtype: "<u8", constructor: BigUint64Array },

    { dtype: "<f4", constructor: Float32Array },
    { dtype: "<f8", constructor: Float64Array },
];

let getConstructor = (dtype: string) => dtypeDict
    .find((corr: Corresponding) => corr.dtype === dtype)
    ?.constructor;

let getDtype = (arr: NdArray) => dtypeDict
    .find((corr: Corresponding) => corr.constructor.name === arr.data.constructor.name)
    ?.dtype;

// TODO: replace with new function Uint8Array.fromBase64() as soon it is available in Node.js
let bufferFromBase64 = (b64: string): ArrayBuffer => {
    let str = atob(b64);
    let bytes = new Uint8Array(str.length);
    utils.range(str.length).forEach(i => bytes[i] = str.charCodeAt(i));
    return bytes.buffer;
};

// TODO: replace with new function Uint8Array.toBase64() as soon it is available in Node.js
let base64FromBuffer = (buffer: ArrayBuffer): string => {
    let str = "";
    let bytes = new Uint8Array(buffer);
    utils.range(bytes.length).forEach(i => str += String.fromCharCode(bytes[i]));
    return btoa(str);
};

// TODO: Do not error on unknown data types, be liberal
export let fromMachine = (params: any[]): NdArray => {
    let TypedArray = getConstructor(params[1]);
    if (!TypedArray) { throw new Error(`Unknown dtype: ${params[1]}`); }

    let buffer = bufferFromBase64(params[2]);
    return ndarray(new TypedArray(buffer), params[0]);
};

export let toMachine = (data: any): Params => {
    let arr = data as NdArray;
    if (!isTypedArray(arr.data)) { throw new Error(`Invalid datatype: ${arr.data.constructor.name}`); }

    let b64 = base64FromBuffer(arr.data.buffer as ArrayBuffer);
    return [ arr.shape, getDtype(arr)!, b64 ];
};

// humans can not edit base64 data which
// justifies this additional conversion
export let fromHuman = (params: any[]): NdArray => {
    let TypedArray = getConstructor(params[1]);
    if (!TypedArray) { throw new Error(`Unknown dtype: ${params[1]}`); }

    let arr = flatten(params[2]);
    return ndarray(new TypedArray(arr), params[0]);
};

export let toHuman = (data: any): ParamsHuman => {
    let arr = data as NdArray;
    return [ arr.shape, getDtype(arr)!, unpack(arr) ];
};

export let forPreview = (data: any): any[] => unpack(data as NdArray);

// TODO: support tuple indices like [1, [2, 3]] and such
export let get = (tagged: any, key: any): any => (tagged as NdArray).pick(key);
export let set = (tagged: any, key: any, value: any) => (tagged as NdArray).set(key, value);