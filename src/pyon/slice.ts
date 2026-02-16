type Slice = { start: number, stop: number, step: number };
type Params = [ start: number, stop: number, step: number ];

export let fromMachine = (params: any[]): Slice => ({
    start: (params as Params)[0],
    stop: (params as Params)[1],
    step: (params as Params)[2],
} as Slice);

export let toMachine = (data: any): Params => ([
    (data as Slice).start,
    (data as Slice).stop,
    (data as Slice).step,
] as Params);

export let fromHuman = fromMachine;
export let toHuman = toMachine;

export let forPreview = (data: any): Slice => (data as Slice);

export let copy = (src: any): any => ({
    start: (src as Slice).start,
    stop: (src as Slice).stop,
    step: (src as Slice).step,
} as Slice);