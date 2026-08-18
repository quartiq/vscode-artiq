let domain = () => {
    let loc = document.location;
    return [ "artiq", loc.pathname, loc.search, loc.hash ].join();
};

export let write = <T>(v: T) => window.localStorage.setItem(domain(), JSON.stringify(v));
export let read = <T>(): T | undefined => {
    let str = window.localStorage.getItem(domain());
    if (str === null) return undefined;

    return JSON.parse(str);
};