import * as argument from "./argument.js";
import * as editors from "./editors.js";
import * as scan from "./scan.js";

// TODO: create lovely graphical editor for rangescan like in artiq_dashboard

let html = `
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
		<input id="NoScan__value" type="number">

		<label for="NoScan__repetitions">Repetitions:</label>
		<input id="NoScan__repetitions" type="number">
	</section>

	<section class="RangeScan">
		<label for="RangeScan__start">Start:</label>
		<input id="RangeScan__start" type="number">

		<label for="RangeScan__stop">Stop:</label>
		<input id="RangeScan__stop" type="number">

		<label for="RangeScan__npoints">Npoints:</label>
		<input id="RangeScan__npoints" type="number">

		<label for="RangeScan__randomize">Randomize:</label>
		<input id="RangeScan__randomize" type="checkbox">
		<input id="RangeScan__seed" type="hidden">
	</section>

	<section class="CenterScan">
		<label for="CenterScan__center">Center:</label>
		<input id="CenterScan__center" type="number">

		<label for="CenterScan__span">Span:</label>
		<input id="CenterScan__span" type="number">

		<label for="CenterScan__step">Step:</label>
		<input id="CenterScan__step" type="number">

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

type Value = number | number[] | boolean

let switchSections = (sections: NodeListOf<Element>, type: string) => sections
    .forEach(s => s.classList.contains(type) ? s.classList.remove("hidden") : s.classList.add("hidden"));

let initSwitch = (el: HTMLSelectElement, sections: NodeListOf<Element>, type: string) => {
    el.value = type;
    switchSections(sections, type);
    el.addEventListener("change", () => switchSections(sections, el.value));
};

let initNumberConstraints = (els: NodeListOf<HTMLInputElement>, procdesc: argument.Scannable) => {
    console.log(procdesc);
    els.forEach(el => {
        procdesc.global_min && el.setAttribute("min", String(procdesc.global_min / procdesc.scale));
        procdesc.global_max && el.setAttribute("max", String(procdesc.global_max / procdesc.scale));
        procdesc.global_step && el.setAttribute("step", String(procdesc.global_step / procdesc.scale));
    });
    // TODO: What about unit and precision though?
    // see: artiq/gui/entries:_*Scan
};

let initSequenceConstraints = (el: HTMLInputElement) => {
	let sequence = String.raw`[+\-]?\d+(?:[.]\d*)?(?:[eE][+\-]?\d+)?(?:\s+[+\-]?\d+(?:[.]\d*)?(?:[eE][+\-]?\d+)?)*\s*`; // see: artiq/gui/entries:_ExplicitScan

	el.setAttribute("pattern", sequence);

	el.addEventListener("blur", () => {
		if (el.validity.patternMismatch) {
			el.setCustomValidity("Please enter space-separated numbers (e.g., 1.5 2.3e-4)"); // TODO: can not read message in UI, because it clips
		}
		el.reportValidity();
	});

	el.addEventListener("input", () => {
		el.setCustomValidity("");
	});
};

let populate = (el: HTMLInputElement, val: Value) => {
	let handlers: Record<string, Function> = {
		"checkbox": () => el.checked = val as boolean,
		"text": () => el.value = (val as number[]).join(" "),
		"number": () => el.value = JSON.stringify(val),
		"hidden": () => el.value = val === null ? "" : JSON.stringify(val),
	};

	handlers[el.type]();
};

let populateAll = (els: NodeListOf<HTMLInputElement>, state: scan.ScanState) => {
    els.forEach(el => {
        let [ty, prop] = el.id.split("__");
        populate(el, state[ty][prop]);
    });
};

let parse = (el: HTMLInputElement): Value => {
	let handlers: Record<string, Function> = {
		"checkbox": () => el.checked,
		"text": () => el.value.split(" "),
		"number": () => Number(el.value),
		"hidden": () => el.value === "" ? null : JSON.parse(el.value),
	};

	return handlers[el.type]();
};

let parseAll = (el: HTMLElement): scan.ScanState => {
    let state: scan.ScanState = {} as scan.ScanState;
    state.selected = el.querySelector("select")!.value;

    el.querySelectorAll("input").forEach(input => {
        let [ty, prop] = input.id.split("__");
        (state[ty] ??= {})[prop] = parse(input);
    });

    return state;
};

let initSaveButton = (el: HTMLElement, info: editors.Info<argument.Scannable>) => {
    el.querySelector(".button.save")!.addEventListener("click", () => {
        info.success(parseAll(el));
        el.remove();
        document.body.classList.remove("noscroll");
    });
};

let initDiscardButton = (el: HTMLElement, info: editors.Info<argument.Scannable>) => {
    el.querySelector(".button.discard")!.addEventListener("click", () => {
        info.cancel();
        el.remove();
        document.body.classList.remove("noscroll");
    });
};

export let from: editors.Editor<argument.Scannable> = info => {
	let el = document!.createElement("div");
	el.classList.add("scan");
	el.innerHTML = html;

	initSwitch(el.querySelector(".scan header select") as HTMLSelectElement, el.querySelectorAll("section"), info.arg[3].selected);
    initNumberConstraints(el.querySelectorAll(`input[type="number"]`), info.arg[0]);
    initSequenceConstraints(el.querySelector("#ExplicitScan__sequence") as HTMLInputElement);

    populateAll(el.querySelectorAll("input"), info.arg[3]);
    initSaveButton(el, info);
    initDiscardButton(el, info);

    document.body.appendChild(el);
    document.body.classList.add("noscroll");
	return el;
};