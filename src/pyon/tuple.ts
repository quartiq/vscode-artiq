type Tuple = any[];
type Params = [ tuple: Tuple ];

export let fromMachine = (params: any[]): Tuple => (params as Params)[0] as Tuple;
export let toMachine = (data: any): Params => [ data as Tuple ] as Params;

export let fromHuman = fromMachine;
export let toHuman = toMachine;

export let forPreview = (data: any): Tuple => data as Tuple;