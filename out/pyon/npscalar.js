import * as dtype from "./dtype.js";
import * as utils from "../utils.js";
let from = (dtypeName, data) => {
    let TypedArray = dtype.from(dtypeName);
    let typed = new TypedArray(data);
    typed.__dtype__ = dtypeName;
    return typed;
};
export let fromMachine = ([dtypeName, base64]) => {
    let buffer = utils.bytesFrom(base64).buffer;
    return from(dtypeName, buffer);
};
export let toMachine = (data) => {
    let base64 = utils.base64From(new Uint8Array(data.buffer));
    return [data.__dtype__, base64];
};
export let fromHuman = ([dtypeName, arr]) => from(dtypeName, arr);
// humans can not edit base64 data which
// justifies this additional conversion
export let toHuman = (data) => [
    data.__dtype__,
    [...data],
];
export let forPreview = (data) => [...data];
export let copy = (src) => {
    let dest = src.slice();
    dest.__dtype__ = src.__dtype__;
    return dest;
};
//# sourceMappingURL=npscalar.js.map