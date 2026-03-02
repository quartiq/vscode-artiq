// see: m-labs/sipyco/pyon:_encode_nparray()
import ndarray, { NdArray } from "ndarray";
import isTypedArray from "is-typed-array";
import * as utils from "../utils";

type Params = [ shape: number[], dtype: string, data: string ];

// Mapping numpy-like dtypes to JS TypedArray subtypes
// see: https://numpy.org/doc/stable/reference/arrays.interface.html#object.__array_interface__
// TODO: implement float16, float128, bUcmOVS and big-endianness
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

export let revive = (params: any[]): any => {
    let TypedArray = getConstructor(params[1]);
    if (!TypedArray) { throw new Error(`Unknown dtype: ${params[1]}`); }

    let buffer = bufferFromBase64(params[2]);
    return ndarray(new TypedArray(buffer), params[0]);
};

export let replace = (data: any): Params => {
    let arr = data as NdArray;
    if (!isTypedArray(arr.data)) { throw new Error(`Invalid datatype: ${arr.data.constructor.name}`); }

    return [
        arr.shape,
        getDtype(arr)!,
        base64FromBuffer(arr.data.buffer as ArrayBuffer),
    ];
};

export let fmt = (data: any): string => {
    let arr = data as NdArray;
    // e. g. [[2, 3], "<u2", {"0": 43, "1": 3, "2": 45, "3": 8, "4": 67, "5": 90}]
    return JSON.stringify([
        arr.shape,
        getDtype(arr),
        arr.data,
    ]);
};

export let parse = (s: string): any => {
    let [shape, dtype, data] = JSON.parse(s);

    let TypedArray = getConstructor(dtype);
    if (!TypedArray) { throw new Error(`Unknown dtype: ${dtype}`); }

    let arr = utils.range(Object.keys(data).length).map(i => data[i]);
    return ndarray(new TypedArray(arr), shape);
};