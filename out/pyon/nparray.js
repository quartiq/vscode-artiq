import * as npscalar from "./npscalar.js";
export let fromMachine = ([shape, dtypeName, base64]) => {
    let typed = npscalar.fromMachine([dtypeName, base64]);
    typed.__shape__ = shape;
    return typed;
};
export let toMachine = (data) => {
    let params = npscalar.toMachine(data);
    return [data.__shape__, ...params];
};
export let fromHuman = ([shape, dtypeName, arr]) => {
    let typed = npscalar.fromHuman([dtypeName, arr]);
    typed.__shape__ = shape;
    return typed;
};
export let toHuman = (data) => {
    let params = npscalar.toHuman(data);
    return [data.__shape__, ...params];
};
export let forPreview = (data) => [...data];
export let copy = (src) => {
    let dest = npscalar.copy(src);
    dest.__shape__ = src.__shape__;
    return dest;
};
// TODO: support tuple indices like [1, [2, 3]] and such
export let get = (tagged, key) => tagged[key];
export let set = (tagged, key, value) => tagged[key] = value;
//# sourceMappingURL=nparray.js.map