export let fromMachine = (params) => new Float64Array(params);
export let toMachine = (data) => [...data];
export let fromHuman = fromMachine;
export let toHuman = toMachine;
export let forPreview = (data) => {
    let sign = data[1] < 0 ? "-" : "+";
    return `${data[0]} ${sign} ${Math.abs(data[1])}j`;
};
export let copy = (src) => src.slice();
//# sourceMappingURL=complex.js.map