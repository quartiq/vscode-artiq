// see sequence.plantuml
const marker = "__jsonclass__"; // see: m-labs/sipyco/pyon

let isMarked = (v: any): boolean => v &&
    typeof v === "object" &&
    marker in v;

type Params = any[];
type JsonClass = [name: string, params: Params];
type HintedJsonClass = { [marker]: JsonClass }; // see: https://www.jsonrpc.org/specification_v1#a3.JSONClasshinting
let isHintedJsonClass = (v: any): boolean => isMarked(v) &&
    Object.keys(v).length === 1 &&
    Array.isArray(v[marker]) &&
    v[marker].length === 2 &&
    typeof v[marker][0] === "string" &&
    Array.isArray(v[marker][1]);

// we use a marker key to tag type info, because
// instanceof or constructor.name may be lost
// by operations like structuredClone() in the meantime
export type TypeTaggedObject = { [marker: string]: string };
export let isTypeTaggedObject = (v: any): boolean => isMarked(v) &&
    typeof v[marker] === "string";

type ConvName = keyof ConvInterface;
type Reviver = (params: Params) => any; // any := TypeTaggedObject
type Replacer = (data: TypeTaggedObject) => Params;
type Previewer = (data: TypeTaggedObject) => any;

interface ConvInterface {
    fromMachine: Reviver, toMachine: Replacer,

    // TODO: for now fromHuman and toHuman return PYON v2 JSON
    // maybe one day, the user may enjoy editing python style formatted strings
    fromHuman: Reviver, toHuman: Replacer,
    forPreview: Previewer, // this is one-way, so it may be very liberal
}

interface TypeInterface extends ConvInterface {
    get?: (tagged: TypeTaggedObject, key: any) => any,
    set?: (tagged: TypeTaggedObject, key: any, value: any) => void,
    del?: (tagged: TypeTaggedObject, key: any) => void,
}

type IdentityConv = (v: any) => any;
let identityConv = (v: any) => v;
let identityType: Record<ConvName, IdentityConv> = {
    fromMachine: identityConv, toMachine: identityConv,
    fromHuman: identityConv, toHuman: identityConv,
    forPreview: identityConv,
};

let conv = (t: string, c: ConvName): Reviver | Replacer | IdentityConv => {
    let type = types[t];
    if (!type) {
        // TODO: distinguish between valid PYON v2 types, not yet implemented
        // and random text
        console.error(`PYON type not yet implemented: ${t}`);
        return identityType[c];
    }
    return type[c];
};

// TODO: implement missing types
import * as set from "./set.js";
import * as dict from "./dict.js";
import * as tuple from "./tuple.js";
import * as nparray from "./nparray.js";
export const types: Record<string, TypeInterface> = { set, dict, tuple, nparray };

let toTagged = (v: HintedJsonClass, convname: ConvName): TypeTaggedObject => {
    let [typename, params] = v[marker];
    let reviver = conv(typename, convname);

    let revived = reviver(params);
    revived[marker] = typename;
    return revived as TypeTaggedObject;
};

let toHinted = (v: TypeTaggedObject, convname: ConvName): HintedJsonClass => {
    let typename = v[marker];
    delete v[marker];
    let replacer = conv(typename, convname);

    let replaced: Record<string, any> = {};
    replaced[marker] = [typename, replacer(v)];
    return replaced as HintedJsonClass;
};

export type Decoder = (hinted: string) => any; // HintedJsonClass -> TypeTaggedObject
export type Encoder = (tagged: any) => string; // TypeTaggedObject -> HintedJsonClass

export let decode: Decoder = hinted => JSON.parse(hinted, (k: string, v: any): any => {
    if (!isHintedJsonClass(v)) { return v; }
    return toTagged(v, "fromMachine");
});

export let encode: Encoder = tagged => JSON.stringify(structuredClone(tagged), (k: string, v: any): any => {
    if (!isTypeTaggedObject(v)) { return v; }
    return toHinted(v, "toMachine");
});

export let parse: Decoder = hinted => JSON.parse(hinted, (k: string, v: any): any => {
    if (!isHintedJsonClass(v)) { return v; }
    return toTagged(v, "fromHuman");
});

export let fmt: Encoder = tagged => JSON.stringify(structuredClone(tagged), (k: string, v: any): any => {
    if (!isTypeTaggedObject(v)) { return v; }
    return toHinted(v, "toHuman");
});

export let preview: Encoder = tagged => JSON.stringify(structuredClone(tagged), (k: string, v: any): any => {
    if (!isTypeTaggedObject(v)) { return v; }
    return toHinted(v, "forPreview");
});