type Set = any[];
type Params = [ set: Set ];

export let fromMachine = (params: any[]): Set => (params as Params)[0] as Set;
export let toMachine = (data: any): Params => [ data as Set ] as Params;

export let fromHuman = fromMachine;
export let toHuman = toMachine;

export let forPreview = (data: any): Set => data as Set;

export let get = (tagged: any, key: any): any => (tagged as Set)[key];
export let set = (tagged: any, key: any, value: any) => (tagged as Set)[key] = value;
export let del = (tagged: any, key: any) => delete (tagged as Set)[key];