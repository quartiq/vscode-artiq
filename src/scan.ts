export interface ScanObject {
    ty: string,
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