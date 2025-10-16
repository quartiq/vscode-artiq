type Tuple = any[];

export let revive = (params: any[]): Tuple => params[0] as Tuple;
export let replace = (data: any): any[] => Array.from(data as Tuple);

export let fmt = (data: any): string => JSON.stringify(data);
export let parse = (s: string): Tuple => JSON.parse(s) as Tuple;