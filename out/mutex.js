export let lock = () => {
    let unlock;
    return {
        locked: new Promise(r => unlock = r),
        unlock: unlock,
    };
};
//# sourceMappingURL=mutex.js.map