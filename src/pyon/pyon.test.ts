import { describe, it, expect } from "vitest";
import { join } from "path";
import { readFileSync } from "fs";
import Fraction from "fraction.js";

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

let tupleArrayKey = [1, 2] as any;
tupleArrayKey.__jsonclass__ = "tuple";

describe("dict", () => {
    it("should match the structure of a JS pyon dict", () => {
        expect(tagged.get("od")).toStrictEqual(new Map([
            [ 2, "a" ], [ 1, "b" ], [ 0, "c" ]
        ]));

        expect(tagged.has(tupleArrayKey)).toBe(true);
    });
});

describe("tuple", () => {
    it("should match the structure of a JS pyon tuple", () => {
        expect(tagged.get(tupleArrayKey)).toStrictEqual([ [3, 4.2], [2] ]);
        tagged.get(tupleArrayKey).forEach((tuple: any) => {
            expect(tuple.__jsonclass__).toBe("tuple");
        });
    });
});

let linspaceKey = new Fraction(3, 4) as any;
linspaceKey.__jsonclass__ = "Fraction";

describe("Fraction", () => {
    it("should match the structure of a JS pyon Fraction", () => {
        expect(tagged.has(linspaceKey)).toBe(true);
    });
});

describe("nparray", () => {
    it("should match the structure of a JS pyon nparray", () => {
        expect(tagged.get(linspaceKey).shape).toStrictEqual([1]);
        expect(tagged.get(linspaceKey).data.constructor).toBe(Float64Array);
        expect(tagged.get(linspaceKey).data.length).toBe(1);
        expect(tagged.get(linspaceKey).data[0]).toBe(5);

        expect(tagged.get("zerodim").shape).toStrictEqual([]);
        expect(tagged.get("zerodim").data.constructor).toBe(BigInt64Array);
        expect(tagged.get("zerodim").data.length).toBe(1);
        expect(tagged.get("zerodim").data[0]).toBe(0n);
    });
});