import * as dtype from "./dtype.js";
import * as utils from "../utils.js";

type NpScalar = dtype.TypedArray & { __dtype__: string };
type Params = [ dtype: string, base64: string ];

export let fromMachine = ([dtypeName, base64]: any[]): NpScalar => {
    let TypedArray = dtype.from(dtypeName);
    let buffer = utils.bytesFrom(base64).buffer as ArrayBuffer;
    let arr = new TypedArray(buffer) as NpScalar;
    arr.__dtype__ = dtypeName;
    return arr;
};

export let toMachine = (data: any): Params => {
    let base64 = utils.base64From(new Uint8Array((data as NpScalar).buffer));
    return ([ (data as NpScalar).__dtype__, base64 ] as Params);
};

export let fromHuman = fromMachine;
export let toHuman = toMachine;

export let forPreview = (data: any): NpScalar => (data as NpScalar);

export let copy = (src: any): any => {
    let dest = src.slice();
    dest.__dtype__ = src.__dtype__;
    return dest as NpScalar;
};