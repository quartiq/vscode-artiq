export let fromMachine = (params) => params[0];
export let toMachine = (data) => [data];
export let fromHuman = fromMachine;
export let toHuman = toMachine;
export let forPreview = (data) => data;
export let copy = (src) => [...src];
export let get = (tagged, key) => tagged[key];
export let set = (tagged, key, value) => tagged[key] = value;
export let del = (tagged, key) => delete tagged[key];
//# sourceMappingURL=tuple.js.map