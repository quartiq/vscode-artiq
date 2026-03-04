export let toSubmitInfo = (syncinfo) => {
    let entries = Object.entries(syncinfo).map(([k, v]) => [k, v[3]]);
    return Object.fromEntries(entries);
};
//# sourceMappingURL=argument.js.map