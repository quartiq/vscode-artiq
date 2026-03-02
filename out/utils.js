export let splitOnLast = (str, delimiter) => {
    let i = str.lastIndexOf(delimiter);
    if (i === -1) {
        return [str, undefined];
    }
    return [str.slice(0, i), str.slice(i + delimiter.length)];
};
let splitArrOnLast = (arr) => [arr.slice(0, -1), arr[arr.length - 1]];
export let getByPath = (target, path) => path.reduce((acc, key) => acc[key], target);
export let setByPath = (target, keys, value) => {
    let [approach, access] = splitArrOnLast(keys);
    getByPath(target, approach)[access] = value;
};
export let clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export let logging = {
    // see: https://docs.python.org/3/library/logging.html#logging-levels
    NOTSET: 0,
    DEBUG: 10,
    INFO: 20,
    WARNING: 30,
    ERROR: 40,
    CRITICAL: 50,
};
export let unixsecs = (date) => Math.floor(date.getTime() / 1000);
export let nowsecs = () => Math.floor(Date.now() / 1000);
export let datetimelocal = (secs) => {
    let date = new Date(secs * 1000);
    let a = date.getFullYear();
    let mo = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    let d = String(date.getDate()).padStart(2, "0");
    let h = String(date.getHours()).padStart(2, "0");
    let min = String(date.getMinutes()).padStart(2, "0");
    return `${a}-${mo}-${d}T${h}:${min}`;
};
// FIXME: use Uint8Array.fromBase64() as soon it is available
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64
export let bytesFrom = (base64) => Uint8Array.from(atob(base64), c => c.charCodeAt(0));
// FIXME: use Uint8Array.prototype.toBase64() as soon it is available
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64
export let base64From = (bytes) => btoa(String.fromCharCode(...bytes));
//# sourceMappingURL=utils.js.map