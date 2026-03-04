import * as scanwidget from "./scanwidget.js";
// TODO: create lovely graphical editor for rangescan like in artiq_dashboard
const html = `
	<header>
		<select>
			<option>NoScan</option>
			<option>RangeScan</option>
			<option>CenterScan</option>
			<option>ExplicitScan</option>
		</select>
	</header>

	<section class="NoScan">
		<label for="NoScan__value">Value:</label>
        <div class="input">
            <div class="unit-prefix hidden"></div>
            <input id="NoScan__value" type="number">
        </div>

		<label for="NoScan__repetitions">Repetitions:</label>
		<input id="NoScan__repetitions" type="number">
	</section>

	<section class="RangeScan">
        <div class="scan-widget"></div>

		<label for="RangeScan__start">Start:</label>
        <div class="input">
            <div class="unit-prefix hidden"></div>
            <input id="RangeScan__start" type="number">
        </div>

		<label for="RangeScan__stop">Stop:</label>
        <div class="input">
            <div class="unit-prefix hidden"></div>
            <input id="RangeScan__stop" type="number">
        </div>

		<label for="RangeScan__npoints">Npoints:</label>
		<input id="RangeScan__npoints" type="number">

		<label for="RangeScan__randomize">Randomize:</label>
		<input id="RangeScan__randomize" type="checkbox">
		<input id="RangeScan__seed" type="hidden">
	</section>

	<section class="CenterScan">
		<label for="CenterScan__center">Center:</label>
        <div class="input">
            <div class="unit-prefix hidden"></div>
            <input id="CenterScan__center" type="number">
        </div>

		<label for="CenterScan__span">Span:</label>
        <div class="input">
            <div class="unit-prefix hidden"></div>
            <input id="CenterScan__span" type="number">
        </div>

		<label for="CenterScan__step">Step:</label>
        <div class="input">
            <div class="unit-prefix hidden"></div>
            <input id="CenterScan__step" type="number">
        </div>

		<label for="CenterScan__randomize">Randomize:</label>
		<input id="CenterScan__randomize" type="checkbox">
		<input id="CenterScan__seed" type="hidden">
	</section>

	<section class="ExplicitScan">
		<label for="ExplicitScan__sequence">Sequence:</label>
		<input id="ExplicitScan__sequence" type="text">
	</section>

	<footer>
		<div class="button save">Save</div>
		<div class="button discard">Discard</div>
	</footer>
`;
let switchSections = (sections, type, widget) => sections.forEach(s => {
    s.classList.contains(type) ? s.classList.remove("hidden") : s.classList.add("hidden");
    if (s.classList.contains("RangeScan")) {
        widget.updateLayout();
    }
});
let initSwitch = (el, sections, type, widget) => {
    el.value = type;
    switchSections(sections, type, widget);
    el.addEventListener("change", () => switchSections(sections, el.value, widget));
};
let initNumberConstraints = (els, procdesc) => {
    els.forEach(el => {
        procdesc.global_min && el.setAttribute("min", String(procdesc.global_min / procdesc.scale));
        procdesc.global_max && el.setAttribute("max", String(procdesc.global_max / procdesc.scale));
        // FIXME ignore "global_step" for now, because setting
        // input attribute "step" creates "invalid" events for values in between steps
        // this is impossible to suppress by code and it interferes with "precision"
        el.setAttribute("step", "any");
        el.addEventListener("change", () => el.value = Number(el.value).toPrecision(procdesc.precision));
    });
};
let initUnitIndicator = (els, unit) => unit && els.forEach(el => {
    el.classList.remove("hidden");
    el.innerText = unit;
});
let initSequenceConstraints = (el) => {
    let sequence = String.raw `[+\-]?\d+(?:[.]\d*)?(?:[eE][+\-]?\d+)?(?:\s+[+\-]?\d+(?:[.]\d*)?(?:[eE][+\-]?\d+)?)*\s*`; // see: artiq/gui/entries:_ExplicitScan
    el.setAttribute("pattern", sequence);
    el.addEventListener("blur", () => {
        if (el.validity.patternMismatch) {
            el.setCustomValidity("Please enter space-separated numbers (e.g., 1.5 2.3e-4)"); // TODO: can not read message in UI, because it clips
        }
        el.reportValidity();
    });
    el.addEventListener("input", () => el.setCustomValidity(""));
};
let populate = (el, val, precision) => {
    let handlers = {
        "checkbox": () => el.checked = val,
        "text": () => el.value = val.join(" "),
        "number": () => el.value = el.matches(".unit-prefix + *") ? val.toPrecision(precision) : JSON.stringify(val),
        "hidden": () => el.value = val === null ? "" : JSON.stringify(val),
    };
    handlers[el.type]();
};
let populateAll = (els, state, precision) => {
    els.forEach(el => {
        let [ty, prop] = el.id.split("__");
        populate(el, state[ty][prop], precision);
    });
};
let parse = (el) => {
    let handlers = {
        "checkbox": () => el.checked,
        "text": () => el.value.split(" "),
        "number": () => Number(el.value),
        "hidden": () => el.value === "" ? null : JSON.parse(el.value),
    };
    return handlers[el.type]();
};
let parseAll = (el) => {
    let state = {};
    state.selected = el.querySelector("select").value;
    el.querySelectorAll("input").forEach(input => {
        let [ty, prop] = input.id.split("__");
        (state[ty] ??= {})[prop] = parse(input);
    });
    return state;
};
let initSaveButton = (el, info) => {
    el.querySelector(".button.save").addEventListener("click", () => {
        // TODO check and report invalid input fields
        info.success(parseAll(el));
        el.remove();
        document.body.classList.remove("noscroll");
    });
};
let initDiscardButton = (el, info) => {
    el.querySelector(".button.discard").addEventListener("click", () => {
        info.cancel(info.arg[3]);
        el.remove();
        document.body.classList.remove("noscroll");
    });
};
let initWidget = (el, info) => {
    let widget = new scanwidget.ScanWidget(el.querySelector(".scan-widget"));
    widget.setStart(info.arg[3].RangeScan.start);
    widget.setStop(info.arg[3].RangeScan.stop);
    widget.setNpoints(info.arg[3].RangeScan.npoints);
    ["Start", "Stop", "Npoints"].forEach(bound => {
        let input = el.querySelector(`#RangeScan__${bound.toLowerCase()}`);
        widget[`on${bound}Changed`] = (v) => populate(input, v, info.arg[0].precision);
        input.addEventListener("change", () => widget[`set${bound}`](parse(input)));
    });
    return widget;
};
export let from = info => {
    let el = document.createElement("div");
    el.classList.add("scan");
    el.innerHTML = html;
    initNumberConstraints(el.querySelectorAll(`.unit-prefix + input[type="number"]`), info.arg[0]);
    initUnitIndicator(el.querySelectorAll(".unit-prefix"), info.arg[0].unit);
    initSequenceConstraints(el.querySelector("#ExplicitScan__sequence"));
    populateAll(el.querySelectorAll("input"), info.arg[3], info.arg[0].precision);
    initSaveButton(el, info);
    initDiscardButton(el, info);
    // TODO: context menus: "view range", "snap range"
    let widget = initWidget(el, info);
    initSwitch(el.querySelector(".scan header select"), el.querySelectorAll("section"), info.arg[3].selected, widget);
    document.body.appendChild(el);
    document.body.classList.add("noscroll");
    return el;
};
//# sourceMappingURL=scaneditor.js.map