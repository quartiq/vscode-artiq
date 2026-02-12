type Bytes = number[];
type Params = [ base64: string ];

// FIXME: use Uint8Array.fromBase64() as soon it is available
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64
export let fromMachine = (params: any[]): Bytes => {
    let chars = [ ...atob((params as Params)[0]) ];
    return chars.map(c => c.charCodeAt(0)) as Bytes;
};

// FIXME: use Uint8Array.prototype.toBase64() as soon it is available
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64
export let toMachine = (data: any): Params => {
    let base64 = btoa(String.fromCharCode(...(data as Bytes)));
    return [ base64 ] as Params;
};

export let fromHuman = fromMachine;
export let toHuman = toMachine;

// FIXME: use Uint8Array.prototype.toHex() as soon it is available
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toHex
export let forPreview = (data: any): string[] => (data as Bytes).map(b => b.toString(16));

export let copy = (src: any): any => [ ...src ];