import { describe, it, expect } from "vitest";
import { join } from "path";
import { readFileSync } from "fs";

import * as pyon from "./pyon.js";

let hinted = readFileSync(join(__dirname, "pyon_v2.test.json"), "utf8");
let tagged = pyon.decode(hinted);

let normalize = (s: string): string => JSON.stringify(JSON.parse(s));

describe("roundtrip", () => {
    it("should be identical to the input JSON", () => {
        expect(normalize(pyon.encode(tagged))).toBe(normalize(hinted));
    });
});

describe("set", () => {
    it("should match the structure of a JS pyon set", () => {
        expect(tagged.get("set")).toStrictEqual([ "testing", "sets" ]);
        expect(tagged.get("set").__jsonclass__).toBe("set");
    });
});

describe("tuple", () => {
    it("should match the structure of a JS pyon tuple", () => {
        let tupleArrayKey = [1, 2] as any;
        tupleArrayKey.__jsonclass__ = "tuple";

        expect(tagged.get(tupleArrayKey)).toStrictEqual([ [3, 4.2], [2] ]);
        tagged.get(tupleArrayKey).forEach((tuple: any) => {
            expect(tuple.__jsonclass__).toBe("tuple");
        });
    });
});