export type Lock = {
    locked: Promise<Function>;
    unlock: any;
}

export let lock = (): Lock => {
    let unlock;
    return {
        locked: new Promise(r => unlock = r),
        unlock: unlock,
    };
};