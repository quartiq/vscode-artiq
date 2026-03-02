import * as pyon from "./pyon.js";
export let validate = (hinted, decode) => {
    try {
        decode(hinted);
        return true;
    }
    catch (e) {
        return false;
    }
};
export let get = (tagged, key) => pyon.types[tagged.__jsonclass__].get?.(tagged, key);
export let set = (tagged, key, value) => pyon.types[tagged.__jsonclass__].set?.(tagged, key, value);
export let del = (tagged, key) => pyon.types[tagged.__jsonclass__].del?.(tagged, key);
//# sourceMappingURL=utils.js.map