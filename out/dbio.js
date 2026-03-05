import * as mutex from "./mutex.js";
let db;
// somewhere in code, the db gets updated
// but the the update callback singleton
// (dbio.onUpdate) is not yet initialized
// hence we want to wait for it to be ready
let updateHandler = mutex.lock();
export let init = (ctx) => db = ctx.globalState;
// TODO: should onUpdate be triggered per domain as soon, as
// new domains are implemented besides "experiment"?
export let onUpdate = (fn) => updateHandler.unlock(fn);
export let update = async (k, v) => {
    db.update(k, v);
    await updateHandler.locked.then(fn => fn?.());
};
export let updateAll = async (entries) => {
    entries.forEach(([k, v]) => db.update(k, v));
    await updateHandler.locked.then(fn => fn?.());
};
export let createAll = async (entries) => {
    // only write if key is not yet occupied
    entries.forEach(([k, v]) => !db.get(k) && db.update(k, v));
    await updateHandler.locked.then(fn => fn?.());
};
export let get = (...keypath) => db.get(keypath.join());
export let dump = () => Object.fromEntries(db.keys().map(k => [k, db.get(k)]));
export let flush = () => db.keys().forEach(k => db.update(k, undefined));
//# sourceMappingURL=dbio.js.map