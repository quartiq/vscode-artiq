// Mapping numpy-like dtypes to JS TypedArray subtypes
// see: https://numpy.org/doc/stable/reference/arrays.interface.html#object.__array_interface__
// TODO: implement float16, float128, bUcmOVS and big-endianness
// also check ndarrays internal mapping and package ndarray-complex
let dict = [
    { dtype: "|i1", ctor: Int8Array },
    { dtype: "<i2", ctor: Int16Array },
    { dtype: "<i4", ctor: Int32Array },
    { dtype: "<i8", ctor: BigInt64Array },
    { dtype: "|u1", ctor: Uint8Array },
    { dtype: "<u2", ctor: Uint16Array },
    { dtype: "<u4", ctor: Uint32Array },
    { dtype: "<u8", ctor: BigUint64Array },
    // FIXME: use Float16Array, as soon it is natively available
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float16Array
    //    { dtype: "<f2", ctor: Float16Array },
    { dtype: "<f4", ctor: Float32Array },
    { dtype: "<f8", ctor: Float64Array },
    { dtype: "<c16", ctor: Float64Array },
];
export let from = (dtype) => {
    let entry = dict.find((e) => e.dtype === dtype);
    if (entry) {
        return entry.ctor;
    }
    console.error("Unknown dtype: " + dtype);
    return Uint8Array;
};
export let toString = (ctor) => dict
    .find((e) => e.ctor.name === ctor.name)
    ?.dtype;
//# sourceMappingURL=dtype.js.map