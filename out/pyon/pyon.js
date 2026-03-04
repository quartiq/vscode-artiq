// see sequence.plantuml
const marker = "__jsonclass__"; // see: m-labs/sipyco/pyon
let isMarked = (v) => v &&
    typeof v === "object" &&
    marker in v;
let isHintedJsonClass = (v) => isMarked(v) &&
    Object.keys(v).length === 1 &&
    Array.isArray(v[marker]) &&
    v[marker].length === 2 &&
    typeof v[marker][0] === "string" &&
    Array.isArray(v[marker][1]);
export let isTypeTaggedObject = (v) => isMarked(v) &&
    typeof v[marker] === "string";
let identityConv = (v) => v;
let identityType = {
    fromMachine: identityConv, toMachine: identityConv,
    fromHuman: identityConv, toHuman: identityConv,
    forPreview: identityConv,
    copy: (v) => [...v],
};
// TODO: implement missing types
import * as set from "./set.js";
import * as dict from "./dict.js";
import * as tuple from "./tuple.js";
import * as nparray from "./nparray.js";
import * as Fraction from "./fraction.js";
import * as bytes from "./bytes.js";
import * as slice from "./slice.js";
import * as npscalar from "./npscalar.js";
import * as complex from "./complex.js";
export const types = { set, dict, tuple, nparray, Fraction, bytes, slice, npscalar, complex };
// TODO: export all mayor types?
export { Dict } from "./dict.js";
let conv = (t, c) => {
    let type = types[t];
    if (!type) {
        // TODO: distinguish between valid PYON v2 types, not yet implemented
        // and random text
        console.error(`PYON type not yet implemented: ${t}`);
        return identityType[c];
    }
    return type[c];
};
let toTagged = (v, convname) => {
    let [typename, params] = v[marker];
    let reviver = conv(typename, convname);
    let revived = reviver(params);
    revived[marker] = typename;
    return revived;
};
export let copy = (v) => conv(v[marker], "copy")(v);
let toHinted = (v, convname) => {
    let typename = v[marker];
    let replacer = conv(typename, convname);
    let replaced = {};
    replaced[marker] = [typename, replacer(copy(v))];
    return replaced;
};
// TODO: deal with BigInt roundtrip
// e. g. "zerodim", "d" and "h" in test data hold BigInt
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON#using_json_numbers
export let decode = hinted => JSON.parse(hinted, (k, v) => {
    if (!isHintedJsonClass(v)) {
        return v;
    }
    return toTagged(v, "fromMachine");
});
export let encode = tagged => JSON.stringify(tagged, (k, v) => {
    if (!isTypeTaggedObject(v)) {
        return v;
    }
    return toHinted(v, "toMachine");
});
export let parse = hinted => JSON.parse(hinted, (k, v) => {
    if (!isHintedJsonClass(v)) {
        return v;
    }
    return toTagged(v, "fromHuman");
});
export let fmt = tagged => JSON.stringify(tagged, (k, v) => {
    if (!isTypeTaggedObject(v)) {
        return v;
    }
    return toHinted(v, "toHuman");
});
export let preview = tagged => JSON.stringify(tagged, (k, v) => {
    // FIXME: make use of JSON.rawJSON(v.toString()); as soon as it becomes available
    if (typeof v === "bigint") {
        return v.toString();
    }
    if (!isTypeTaggedObject(v)) {
        return v;
    }
    let typename = v[marker];
    let replacer = conv(typename, "forPreview");
    return [typename, replacer(copy(v))];
});
//# sourceMappingURL=pyon.js.map