type Tuple = any[];
type Params = [ tuple: Tuple ];

export let revive = (params: any[]): Tuple => (params as Params)[0] as Tuple;
export let replace = (data: any): any[] => [ data as Tuple ] as Params;

export let fmt = (data: any): string => JSON.stringify(data);
export let parse = (s: string): Tuple => JSON.parse(s) as Tuple;