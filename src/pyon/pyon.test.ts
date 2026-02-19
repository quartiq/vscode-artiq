import { describe, it, expect } from "vitest";
import matchers from "jest-extended";
expect.extend(matchers);

import { join } from "path";
import { readFileSync } from "fs";
import Fraction from "fraction.js";

import * as pyon from "./pyon.js";
// TODO: test get and set
// TODO: test toHuman and fromHuman

let hinted = readFileSync(join(__dirname, "pyon_v2.test.json"), "utf8");
let tagged = pyon.decode(hinted);

let normalize = (s: string): string => JSON.stringify(JSON.parse(s));

describe("roundtrip", () => {
    it("should be identical to the input JSON", () => {
        expect(normalize(pyon.encode(tagged))).toBe(normalize(hinted));
    });
});

let testCopy = (orig: pyon.TypeTaggedObject) => {
    let copy = pyon.copy(orig);
    expect(copy.__jsonclass__).toBe(undefined);

    copy.__jsonclass__ = orig.__jsonclass__;
    expect(copy).toStrictEqual(orig);
    expect(copy).not.toBe(orig);
};

describe("set", () => {
    it("should match the structure of a JS pyon set", () => {
        expect(tagged.get("set")).toIncludeSameMembers(["testing", "sets"]);
        expect(tagged.get("set").__jsonclass__).toBe("set");
        expect([
            `["set",["testing","sets"]]`,
            `["set",["sets","testing"]]`
        ]).toContain(pyon.preview(tagged.get("set")));
        testCopy(tagged.get("set"));
    });
});

let tupleArrayKey = [1, 2] as any;
tupleArrayKey.__jsonclass__ = "tuple";

describe("dict", () => {
    it("should match the structure of a JS pyon dict", () => {
        expect(tagged.get("od")).toStrictEqual(new Map([
            [2, "a"], [1, "b"], [0, "c"]
        ]));
        expect(tagged.get("od").__jsonclass__).toBe("dict");
        expect(pyon.preview(tagged.get("od"))).toBe(`["dict",[[2,"a"],[1,"b"],[0,"c"]]]`);
        testCopy(tagged.get("od"));

        expect(tagged.has(tupleArrayKey)).toBe(true);
    });
});

describe("tuple", () => {
    it("should match the structure of a JS pyon tuple", () => {
        expect(tagged.get(tupleArrayKey)).toStrictEqual([[3, 4.2], [2]]);
        tagged.get(tupleArrayKey).forEach((tuple: any) => {
            expect(tuple.__jsonclass__).toBe("tuple");
            testCopy(tuple);
        });
        expect(pyon.preview(tagged.get(tupleArrayKey))).toBe(`[["tuple",[3,4.2]],["tuple",[2]]]`);
    });
});

describe("bytes", () => {
    it("should match the structure of JS pyon bytes", () => {
        expect(tagged.get(true)).toStrictEqual(new Uint8Array([98, 121, 116, 101, 115]));
        expect(tagged.get(true).__jsonclass__).toBe("bytes");
        expect(pyon.preview(tagged.get(true))).toBe(`["bytes",["62","79","74","65","73"]]`);
        testCopy(tagged.get(true));
    });
});

describe("slice", () => {
    it("should match the structure of a JS pyon slice", () => {
        expect(tagged.get("slice")).toStrictEqual([ null, 3, null ]);
        expect(tagged.get("slice").__jsonclass__).toBe("slice");
        expect(pyon.preview(tagged.get("slice"))).toBe(`["slice",[null,3,null]]`);
        testCopy(tagged.get("slice"));
    });
});

// TODO: test for __dtype__
describe("npscalar", () => {
    it("should match the structure of a JS pyon npscalar", () => {
        expect(tagged.get("a")).toStrictEqual(new Int8Array([ 9 ]));
        expect(tagged.get("a").__jsonclass__).toBe("npscalar");
        expect(pyon.preview(tagged.get("a"))).toBe(`["npscalar",[9]]`);
        testCopy(tagged.get("a"));
        expect(tagged.get("b")).toStrictEqual(new Int16Array([ -98 ]));
        expect(tagged.get("b").__jsonclass__).toBe("npscalar");
        expect(pyon.preview(tagged.get("b"))).toBe(`["npscalar",[-98]]`);
        testCopy(tagged.get("b"));
        expect(tagged.get("c")).toStrictEqual(new Int32Array([ 42 ]));
        expect(tagged.get("c").__jsonclass__).toBe("npscalar");
        expect(pyon.preview(tagged.get("c"))).toBe(`["npscalar",[42]]`);
        testCopy(tagged.get("c"));
        expect(tagged.get("d")).toStrictEqual(new BigInt64Array([ -5n ]));
        expect(tagged.get("d").__jsonclass__).toBe("npscalar");
        expect(pyon.preview(tagged.get("d"))).toBe(`["npscalar",["-5"]]`);
        testCopy(tagged.get("d"));

        expect(tagged.get("e")).toStrictEqual(new Uint8Array([ 8 ]));
        expect(tagged.get("e").__jsonclass__).toBe("npscalar");
        expect(pyon.preview(tagged.get("e"))).toBe(`["npscalar",[8]]`);
        testCopy(tagged.get("e"));
        expect(tagged.get("f")).toStrictEqual(new Uint16Array([ 5 ]));
        expect(tagged.get("f").__jsonclass__).toBe("npscalar");
        expect(pyon.preview(tagged.get("f"))).toBe(`["npscalar",[5]]`);
        testCopy(tagged.get("f"));
        expect(tagged.get("g")).toStrictEqual(new Uint32Array([ 4 ]));
        expect(tagged.get("g").__jsonclass__).toBe("npscalar");
        expect(pyon.preview(tagged.get("g"))).toBe(`["npscalar",[4]]`);
        testCopy(tagged.get("g"));
        expect(tagged.get("h")).toStrictEqual(new BigUint64Array([ 9n ]));
        expect(tagged.get("h").__jsonclass__).toBe("npscalar");
        expect(pyon.preview(tagged.get("h"))).toBe(`["npscalar",["9"]]`);
        testCopy(tagged.get("h"));

        // FIXME: "x" waits for vanilla Float16Array feature to drop
        //expect(tagged.get("x")).toStrictEqual(new Float16Array([ 9.0 ]));
        expect(tagged.get("y")).toStrictEqual(new Float32Array([ 9.0 ]));
        expect(tagged.get("y").__jsonclass__).toBe("npscalar");
        expect(pyon.preview(tagged.get("y"))).toBe(`["npscalar",[9]]`);
        testCopy(tagged.get("y"));
        // "z" is pyonized to regular js float

        expect(tagged.get("q")).toStrictEqual(new Float64Array([ 0, 1 ]));
        expect(tagged.get("q").__jsonclass__).toBe("npscalar");
        expect(pyon.preview(tagged.get("q"))).toBe(`["npscalar",[0,1]]`);
        testCopy(tagged.get("q"));
    });
});

let linspaceKey = new Fraction(3, 4) as any;
linspaceKey.__jsonclass__ = "Fraction";

describe("Fraction", () => {
    it("should match the structure of a JS pyon Fraction", () => {
        expect(tagged.has(linspaceKey)).toBe(true);
        expect(pyon.preview(linspaceKey)).toBe(`["Fraction","3/4"]`);
        testCopy(linspaceKey);
    });
});

describe("nparray", () => {
    it("should match the structure of a JS pyon nparray", () => {
        expect(tagged.get(linspaceKey).__shape__).toStrictEqual([1]);
        expect(tagged.get(linspaceKey).constructor).toBe(Float64Array);
        expect(tagged.get(linspaceKey).length).toBe(1);
        expect(tagged.get(linspaceKey)[0]).toBe(5);
        expect(tagged.get(linspaceKey).__jsonclass__).toBe("nparray");
        expect(pyon.preview(tagged.get(linspaceKey))).toBe(`["nparray",[5]]`);
        testCopy(tagged.get(linspaceKey));

        expect(tagged.get("zerodim").__shape__).toStrictEqual([]);
        expect(tagged.get("zerodim").constructor).toBe(BigInt64Array);
        expect(tagged.get("zerodim").length).toBe(1);
        expect(tagged.get("zerodim")[0]).toBe(0n);
        expect(tagged.get("zerodim").__jsonclass__).toBe("nparray");
        expect(pyon.preview(tagged.get("zerodim"))).toBe(`["nparray",["0"]]`);
        testCopy(tagged.get("zerodim"));
    });
});

let complexKey = new Float64Array([0, 1]) as any;
complexKey.__jsonclass__ = "complex";

describe("complex", () => {
    it("should match the structure of a JS pyon complex", () => {
        expect(tagged.get(complexKey).length).toBe(2);
        expect(tagged.get(complexKey)[0]).toBe(1);
        expect(tagged.get(complexKey)[1]).toBe(-9);
        expect(tagged.get(complexKey).__jsonclass__).toBe("complex");
        expect(pyon.preview(tagged.get(complexKey))).toBe(`["complex","1 - 9j"]`);
        testCopy(tagged.get(complexKey));
    });
});