import equal from "fast-deep-equal";

class Dict extends Map {
    // like Map, but Object keys are compared by value, not by reference
    // inspired by Python dictionary

    private equalPYON(v1: any, v2: any): boolean {
        return equal(v1, v2) &&
            v1.__jsonclass__ === v2.__jsonclass__;
    }

    private find(key: any): any {
        if (typeof key !== "object") { return key; }

        for (let k of this.keys()) {
            if (this.equalPYON(k, key)) { return k; }
        }

        return key;
    }

    set(key: any, value: any): this {
        return super.set(this.find(key), value);
    }

    get(key: any): any | undefined {
        return super.get(this.find(key));
    }

    has(key: any): boolean {
        return super.has(this.find(key));
    }

    delete(key: any): boolean {
        return super.delete(this.find(key));
    }
}

type Entry = [ key: any, value: any ];
type Params = [ Entry[] ];

export let fromMachine = (params: any[]): Dict => {
    let d = new Dict();
    (params as Params)[0].forEach((e: Entry) => d.set(e[0], e[1]));
    return d;
};

export let toMachine = (data: any): Params => [ Array.from(data as Dict) ] as Params;

export let fromHuman = fromMachine;
export let toHuman = toMachine;

export let forPreview = (data: any): Entry[] => Array.from(data as Dict);

export let get = (tagged: any, key: any): any => (tagged as Dict).get(key);
export let set = (tagged: any, key: any, value: any) => (tagged as Dict).set(key, value);
export let del = (tagged: any, key: any) => (tagged as Dict).delete(key);