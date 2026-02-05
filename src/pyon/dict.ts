import equal from "fast-deep-equal";

class Dict extends Map {
    set(key: any, value: any): this {
        if (typeof key !== "object") {
            super.set(key, value);
            return this;
        }

        let existing = [...this.keys()].find((k: any) => equal(k, key));
        super.set(existing ?? key, value);
        return this;
    }

    get(key: any) {
        if (typeof key !== "object") {
            return super.get(key);
        }

        let existing = [...this.keys()].find((k: any) => equal(k, key));
        return super.get(existing ?? key);
    }
}

type Entry = [ key: any, value: any ];
type Params = [ Entry[] ];

export let fromMachine = (params: any[]): Dict => {
    let m = new Map();
    (params as Params)[0].forEach((e: Entry) => m.set(e[0], e[1]));
    return m as Dict;
};

export let toMachine = (data: any): Params => [ Array.from(data as Dict) ] as Params;

export let fromHuman = fromMachine;
export let toHuman = toMachine;

export let forPreview = (data: any): Entry[] => Array.from(data as Dict);

export let get = (tagged: any, key: any): any => (tagged as Dict).get(key);
export let set = (tagged: any, key: any, value: any) => (tagged as Dict).set(key, value);
export let del = (tagged: any, key: any) => (tagged as Dict).delete(key);