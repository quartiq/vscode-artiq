// based on scijs/ndarray-unpack
// cannot use official package as of right now
// because it depends on vulnerable software
//
// $ npm audit
// ndarray-unpack  >=1.0.0
// Depends on vulnerable versions of cwise

// FIXME: replace this as soon as the
// npm package is safe to use again

import { NdArray } from "ndarray";

let dup = require("dup");
let cwise = require("cwise");

let do_unpack = cwise({
    args: ["array", "scalar", "index"],
    body: function unpackCwise(arr: any, a: any, idx: any) {
        var v = a, i;
        for (i = 0; i < idx.length - 1; ++i) {
            v = v[idx[i]];
        }
        v[idx[idx.length - 1]] = arr;
    },
});

export let unpack = (arr: NdArray): any[] => {
    let result = dup(arr.shape);
    do_unpack(arr, result);
    return result;
};