export let splitOnLast = (str: string, delimiter: string): [string, string | undefined] => {
    let i = str.lastIndexOf(delimiter);
    if (i === -1) { return [str, undefined]; }
    return [str.slice(0, i), str.slice(i + delimiter.length)];
};

let splitArrOnLast = (arr: any[]): [any[], any] => [arr.slice(0, -1), arr[arr.length - 1]];

export let getByPath = (target: Record<string, any>, path: any[]) => path.reduce((acc, key) => acc[key], target);

export let setByPath = (target: Record<string, any>, keys: string[], value: any) => {
    let [approach, access] = splitArrOnLast(keys);
    getByPath(target, approach)[access] = value;
};

export let clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export let logging: { [name: string]: number } = {
    // see: https://docs.python.org/3/library/logging.html#logging-levels
    NOTSET: 0,
    DEBUG: 10,
    INFO: 20,
    WARNING: 30,
    ERROR: 40,
    CRITICAL: 50,
};

export let nowsecs = (): number => Math.floor(Date.now() / 1000);

export let datetimelocal = (secs: number): string => {
    let date = new Date(secs * 1000);

    let a = date.getFullYear();
    let mo = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    let d = String(date.getDate()).padStart(2, "0");
    let h = String(date.getHours()).padStart(2, "0");
    let min = String(date.getMinutes()).padStart(2, "0");

    return `${a}-${mo}-${d}T${h}:${min}`;
};