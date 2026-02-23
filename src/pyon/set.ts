type Params = [ set: any[] ];

export let fromMachine = (params: any[]): Set<any> => new Set((params as Params)[0]);
export let toMachine = (data: any): Params => [[ ...(data as Set<any>) ]] as Params;

export let fromHuman = fromMachine;
export let toHuman = toMachine;

export let forPreview = (data: any): any[] => [ ...(data as Set<any>) ];

export let copy = (src: any): Set<any> => new Set(src as Set<any>);