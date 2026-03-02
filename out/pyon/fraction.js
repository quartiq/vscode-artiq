import Fraction from "fraction.js";
export let fromMachine = (params) => {
    params = params;
    if (params.length === 2) {
        return new Fraction(params[0], params[1]);
    }
    return new Fraction(params[0]);
};
export let toMachine = (data) => {
    let f = data;
    return [Number(f.s * f.n), Number(f.d)];
};
export let fromHuman = fromMachine;
export let toHuman = toMachine;
export let forPreview = (data) => data.toFraction();
export let copy = (src) => new Fraction(src);
//# sourceMappingURL=fraction.js.map