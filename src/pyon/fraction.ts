import Fraction from "fraction.js";

type Params =
    | [ numerator: number, denominator: number ]
    | [ number ]
    | [ string ];

export let fromMachine = (params: any[]): Fraction => {
    params = params as Params;
    if (params.length === 2) {
        return new Fraction(params[0], params[1]);
    }
    return new Fraction(params[0]);
};

export let toMachine = (data: any): Params => {
    let f = data as Fraction;
    return [ Number(f.s * f.n), Number(f.d) ] as Params;
};

export let fromHuman = fromMachine;
export let toHuman = toMachine;

export let forPreview = (data: any): string => (data as Fraction).toString();