import { describe, it, expect } from "vitest";
import * as pyon from "./pyon.js";

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
        expect(pyon.encode(tagged)).toBe(hinted.replaceAll(/\s/g,""));
    });
});

import { join } from "path";
import { readFileSync } from "fs";

let p = join(__dirname, "pyon_v2.test.json");
let testobject = readFileSync(p, "utf8");
console.log(pyon.decode(testobject));