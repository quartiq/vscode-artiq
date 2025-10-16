type Set = [ set: any[] ];

export let revive = (params: any[]): Set => params[0] as Set;
export let replace = (data: any): any[] => [ data ];

export let fmt = (data: any): string => JSON.stringify(data);
export let parse = (s: string): Set => JSON.parse(s) as Set;