// this is a dirty hack for now
// TODO: reform, then implement sipyco/pyon
let jr = require("jsonrepair");

export let decode = (s: string) => {
    s = s.replace(/^\(|\)$/g, "");
    return JSON.parse(jr.jsonrepair(s));
};

export let encode = (v: any) => JSON.stringify(v);