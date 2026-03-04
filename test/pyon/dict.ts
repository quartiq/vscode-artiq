type Dict = Map<any, any>;

type Entry = [ key: any, value: any ];
type Params = [ Entry[] ];

export let revive = (params: any[]): Dict => {
    let m = new Map();
    (params as Params)[0].forEach((e: Entry) => m.set(e[0], e[1]));
    return m as Dict;
};

export let replace = (data: any): Params => [ Array.from(data as Dict) ] as Params;

export let fmt = (params: any[]): string => (params as Params)[0]
    .map((e: Entry) => e.map(v => JSON.stringify(v)).map(s => `${s[0]}: ${s[1]}`))
    .join(", ");

export let parse = (s: string): Dict => JSON.parse(s) as Dict;