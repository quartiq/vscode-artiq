import * as utils from "../utils.js";
export let fromMachine = ([base64]) => utils.bytesFrom(base64);
export let toMachine = (data) => [utils.base64From(data)];
export let fromHuman = fromMachine;
export let toHuman = toMachine;
// FIXME: use Uint8Array.prototype.toHex() as soon it is available
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toHex
export let forPreview = (data) => Array.from(data).map(b => b.toString(16));
export let copy = (src) => src.slice();
//# sourceMappingURL=bytes.js.map