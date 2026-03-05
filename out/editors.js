export let buttons = info => {
    let el = document.createElement("div");
    info.arg[0].choices.forEach((c) => {
        let cel = document.createElement("input");
        cel.setAttribute("type", "button");
        cel.setAttribute("value", c);
        cel.addEventListener("click", ev => {
            info.success(c);
            info.post({ action: "submit" });
        });
        el.append(cel);
    });
    info.onRendered(() => el.focus());
    el.addEventListener("keydown", ev => ev.key === "Escape" && info.cancel(info.arg[3]));
    return el;
};
export let select = info => {
    let el = document.createElement("select");
    info.arg[0].choices.forEach((c) => {
        let cel = document.createElement("option");
        cel.textContent = c;
        cel.setAttribute("value", c);
        el.append(cel);
    });
    el.value = info.arg[3]; // must be set after option creation
    info.onRendered(() => el.focus());
    el.addEventListener("change", () => {
        info.success(el.value);
    });
    el.addEventListener("keydown", ev => ev.key === "Escape" && info.cancel(info.arg[3]));
    return el;
};
export let input = info => {
    let el = document.createElement("input");
    el.value = info.arg[3];
    info.onRendered(() => el.focus());
    el.addEventListener("blur", () => { info.success(info.parse(el)); });
    el.addEventListener("keydown", ev => {
        if (ev.key === "Enter") {
            info.success(info.parse(el));
        }
        if (ev.key === "Escape") {
            info.cancel(info.arg[3]);
        } // FIXME: this seems to be overwritten by the blur event
    });
    return el;
};
//# sourceMappingURL=editors.js.map