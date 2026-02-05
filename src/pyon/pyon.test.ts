import { describe, it, expect } from "vitest";
import * as pyon from "./pyon.js";

let normalize = (s: string): string => JSON.stringify(JSON.parse(s));

let hinted = `
    {
        "__jsonclass__": [
            "tuple",
            [
                [ "foo", 4, true, null ]
            ]
        ]
    }
`;

let tagged = ["foo", 4, true, null ] as any;
tagged["__jsonclass__"] = "tuple";

describe("decode", () => {
    it("should transform HintedJsonClass into TypeTaggedObject", () => {
        expect(pyon.decode(hinted)).toStrictEqual(tagged);
        expect(pyon.decode(hinted)["__jsonclass__"]).toBe("tuple");
    });
});

describe("encode", () => {
    it("should transform TypeTaggedObject into HintedJsonClass", () => {
        expect(normalize(pyon.encode(tagged))).toBe(normalize(hinted));
    });
});

import { join } from "path";
import { readFileSync } from "fs";

let p = join(__dirname, "pyon_v2.test.json");
let _hinted = readFileSync(p, "utf8");
let _tagged = pyon.decode(_hinted);

describe("roundtrip", () => {
    it("should be identical to the input JSON", () => {
        expect(normalize(pyon.encode(_tagged))).toBe(normalize(_hinted));
    });
});

console.log(_tagged);
let tupleArrayKey = _tagged.keys().find((k: any) => k?.__jsonclass__ === "tuple");
describe("tuple", () => {
    it("should match the structure of a JS pyon tuple", () => {
        expect(_tagged.get(tupleArrayKey)).toStrictEqual([ [3, 4.2], [2] ]);
        _tagged.get(tupleArrayKey).forEach((tuple: any) => {
            console.log(tuple);
            //expect(tuple.__jsonclass__).toBe("tuple");
        });
    });
});