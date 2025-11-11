// FIXME: This is a fallback solution of "dict" handling, since viewProvider.post() needs
// JSON serializable data. Use the pattern seen in "dict_map.ts" for vanilla context.

type Entry = [ key: any, value: any ];

type Dict = Entry[];
type Params = [ dict: Dict ];

export let fromMachine = (params: any[]): Dict => (params as Params)[0] as Dict;
export let toMachine = (data: any): Params => [ data as Dict ] as Params;

export let fromHuman = fromMachine;
export let toHuman = toMachine;

export let forPreview = (data: any): Dict => data as Dict;