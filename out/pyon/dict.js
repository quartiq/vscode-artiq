import equal from "fast-deep-equal";
export class Dict extends Map {
    // like Map, but Object keys are compared by value, not by reference
    // inspired by Python dictionary
    equalPYON(v1, v2) {
        return equal(v1, v2) &&
            v1.__jsonclass__ === v2.__jsonclass__;
    }
    find(key) {
        if (typeof key !== "object") {
            return key;
        }
        for (let k of this.keys()) {
            if (this.equalPYON(k, key)) {
                return k;
            }
        }
        return key;
    }
    set(key, value) {
        return super.set(this.find(key), value);
    }
    get(key) {
        return super.get(this.find(key));
    }
    has(key) {
        return super.has(this.find(key));
    }
    delete(key) {
        return super.delete(this.find(key));
    }
}
export let fromMachine = (params) => {
    let d = new Dict();
    params[0].forEach((e) => d.set(e[0], e[1]));
    return d;
};
export let toMachine = (data) => [Array.from(data)];
export let fromHuman = fromMachine;
export let toHuman = toMachine;
export let forPreview = (data) => Array.from(data);
export let copy = (src) => {
    let clone = new Dict();
    for (let [k, v] of src) {
        clone.set(k, v);
    }
    return clone;
};
export let get = (tagged, key) => tagged.get(key);
export let set = (tagged, key, value) => tagged.set(key, value);
export let del = (tagged, key) => tagged.delete(key);
//# sourceMappingURL=dict.js.map