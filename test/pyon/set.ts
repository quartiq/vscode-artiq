type Set = any[];
type Params = [ set: Set ];

export let revive = (params: any[]): Set => (params as Params)[0] as Set;
export let replace = (data: any): Params => [ data as Set ] as Params;

export let fmt = (params: any[]): string => JSON.stringify((params as Params)[0]);
export let parse = (s: string): Set => JSON.parse(s) as Set;