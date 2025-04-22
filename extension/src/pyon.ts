let jr = require("jsonrepair");

export let decode = (s: string) => JSON.parse(jr.jsonrepair(s));
export let encode = (v: any) => JSON.stringify(v);