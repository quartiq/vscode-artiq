import { describe, it, expect } from "vitest";
import matchers from "jest-extended";
expect.extend(matchers);

import { join } from "path";
import { readFileSync } from "fs";
import Fraction from "fraction.js";

import * as pyon from "./pyon.js";
// TODO: test previews

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
        expect(tagged.get("set")).toIncludeSameMembers(["testing", "sets"]);
        expect(tagged.get("set").__jsonclass__).toBe("set");
        expect([
            `["set",["testing","sets"]]`,
            `["set",["sets","testing"]]`
        ]).toContain(pyon.preview(tagged.get("set")));
    });
});

let tupleArrayKey = [1, 2] as any;
tupleArrayKey.__jsonclass__ = "tuple";

describe("dict", () => {
    it("should match the structure of a JS pyon dict", () => {
        expect(tagged.get("od")).toStrictEqual(new Map([
            [ 2, "a" ], [ 1, "b" ], [ 0, "c" ]
        ]));
        expect(tagged.get("od").__jsonclass__).toBe("dict");
        expect(pyon.preview(tagged.get("od"))).toBe(`["dict",[[2,"a"],[1,"b"],[0,"c"]]]`);

        expect(tagged.has(tupleArrayKey)).toBe(true);
    });
});

describe("tuple", () => {
    it("should match the structure of a JS pyon tuple", () => {
        expect(tagged.get(tupleArrayKey)).toStrictEqual([ [3, 4.2], [2] ]);
        tagged.get(tupleArrayKey).forEach((tuple: any) => {
            expect(tuple.__jsonclass__).toBe("tuple");
        });
        expect(pyon.preview(tagged.get(tupleArrayKey))).toBe(`[["tuple",[3,4.2]],["tuple",[2]]]`);
    });
});

let linspaceKey = new Fraction(3, 4) as any;
linspaceKey.__jsonclass__ = "Fraction";

describe("Fraction", () => {
    it("should match the structure of a JS pyon Fraction", () => {
        expect(tagged.has(linspaceKey)).toBe(true);
        expect(pyon.preview(linspaceKey)).toBe(`["Fraction","3/4"]`);
    });
});

describe("nparray", () => {
    // TODO: test toHuman and fromHuman
    it("should match the structure of a JS pyon nparray", () => {
        expect(tagged.get(linspaceKey).shape).toStrictEqual([1]);
        expect(tagged.get(linspaceKey).data.constructor).toBe(Float64Array);
        expect(tagged.get(linspaceKey).data.length).toBe(1);
        expect(tagged.get(linspaceKey).data[0]).toBe(5);
        expect(tagged.get(linspaceKey).__jsonclass__).toBe("nparray");
        expect(pyon.preview(tagged.get(linspaceKey))).toBe(`["nparray",[5]]`);

        expect(tagged.get("zerodim").shape).toStrictEqual([]);
        expect(tagged.get("zerodim").data.constructor).toBe(BigInt64Array);
        expect(tagged.get("zerodim").data.length).toBe(1);
        expect(tagged.get("zerodim").data[0]).toBe(0n);
        expect(tagged.get("zerodim").__jsonclass__).toBe("nparray");
        expect(pyon.preview(tagged.get("zerodim"))).toBe(`["nparray","0"]`);
    });
});

describe("bytes", () => {
    it("should match the structure of JS pyon bytes", () => {
        expect(tagged.get(true)).toStrictEqual([98, 121, 116, 101, 115]);
        expect(tagged.get(true).__jsonclass__).toBe("bytes");
        expect(pyon.preview(tagged.get(true))).toBe(`["bytes",["62","79","74","65","73"]]`);
    });
});

describe("slice", () => {
    it("should match the structure of a JS pyon slice", () => {
        expect(tagged.get("slice")).toStrictEqual({ start: null, stop: 3, step: null, __jsonclass__: "slice" });
        expect(pyon.preview(tagged.get("slice"))).toBe(`["slice",{"start":null,"stop":3,"step":null}]`);
    });
});