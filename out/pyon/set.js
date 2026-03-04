export let fromMachine = (params) => new Set(params[0]);
export let toMachine = (data) => [[...data]];
export let fromHuman = fromMachine;
export let toHuman = toMachine;
export let forPreview = (data) => [...data];
export let copy = (src) => new Set(src);
//# sourceMappingURL=set.js.map