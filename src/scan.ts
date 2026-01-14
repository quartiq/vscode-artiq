type Ty = string
export type Value = number | number[] | boolean

export interface ScanState extends Record<string, any> {
	selected: Ty,
	NoScan: NoScan,
	RangeScan: RangeScan,
	CenterScan: CenterScan,
	ExplicitScan: ExplicitScan,
}

export interface ScanObject {
    ty?: Ty,
}

interface NoScan extends ScanObject {
	ty: "NoScan",
	value: number,
	repetitions: number,
}

interface RangeScan extends ScanObject {
	ty: "RangeScan",
	start: number,
	stop: number,
	npoints: number,
	randomize: boolean,
	seed: number,
}

interface CenterScan extends ScanObject {
	ty: "CenterScan",
	center: number,
	span: number,
	step: number,
	randomize: boolean,
	seed: number,
}

interface ExplicitScan extends ScanObject {
	ty: "ExplicitScan",
	sequence: number[],
}

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
		<input id="NoScan__value" type="number" step="0.1">

		<label for="NoScan__repetitions">Repetitions:</label>
		<input id="NoScan__repetitions" type="number" step="1" min="1">
	</section>

	<section class="RangeScan">
		<label for="RangeScan__start">Start:</label>
		<input id="RangeScan__start" type="number" step="0.1">

		<label for="RangeScan__stop">Stop:</label>
		<input id="RangeScan__stop" type="number" step="0.1">

		<label for="RangeScan__npoints">Npoints:</label>
		<input id="RangeScan__npoints" type="number" step="1" min="1">

		<label for="RangeScan__randomize">Randomize:</label>
		<input id="RangeScan__randomize" type="checkbox">
		<input id="RangeScan__seed" type="hidden">
	</section>

	<section class="CenterScan">
		<label for="CenterScan__center">Center:</label>
		<input id="CenterScan__center" type="number" step="0.1">

		<label for="CenterScan__span">Span:</label>
		<input id="CenterScan__span" type="number" step="0.1" min="0">

		<label for="CenterScan__step">Step:</label>
		<input id="CenterScan__step" type="number" step="0.1" min="0">

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

let initSequenceEl = (el: HTMLInputElement) => {
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

let initSwitchEl = (el: HTMLSelectElement, sections: NodeListOf<Element>) => {
	el.addEventListener("change", ev => {
		sections.forEach(s => {
			s.classList.add("hidden");
			if (s.classList.contains(el.value)) {
				s.classList.remove("hidden");
			}
		});
	});
};

export let editor: () => HTMLElement = () => {
	let el = document!.createElement("div");
	el.classList.add("scan");
	el.innerHTML = html;

	initSequenceEl(el.querySelector("#ExplicitScan__sequence") as HTMLInputElement);
	initSwitchEl(el.querySelector(".scan header select") as HTMLSelectElement, el.querySelectorAll("section"));

	return el;
};

// TODO: take scale and precision into account

export let populate = (el: HTMLInputElement, val: Value) => {
	let handlers: Record<string, Function> = {
		"checkbox": () => el.checked = val as boolean,
		"text": () => el.value = (val as number[]).join(" "),
		"number": () => el.value = JSON.stringify(val),
		"hidden": () => el.value = val === null ? "" : JSON.stringify(val),
	};

	handlers[el.type]();
};

export let parse = (el: HTMLInputElement): Value => {
	let handlers: Record<string, Function> = {
		"checkbox": () => el.checked,
		"text": () => el.value.split(" "),
		"number": () => Number(el.value),
		"hidden": () => el.value === "" ? null : JSON.parse(el.value),
	};

	return handlers[el.type]();
};