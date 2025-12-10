export type Ty = string
type Name = string
type State = any

export type Argument = [procdesc: Procdesc, group: any, tooltip: string, state: State]
export type SyncInfo = Record<Name, Argument>
export type SubmitInfo = Record<Name, State>

export let toSubmitInfo = (syncinfo: SyncInfo): SubmitInfo => {
    let entries = Object.entries(syncinfo).map(([k, v]) => [k, v[3]]);
    return Object.fromEntries(entries);
};

export interface Procdesc {
	ty: Ty,
	default: any,
}

export interface Boolean extends Procdesc {
	ty: "BooleanValue",
	default: boolean,
}

export interface Enum extends Procdesc {
	ty: "EnumerationValue",
	choices: any[],
	quickstyle: boolean,
}

export interface Number extends Procdesc {
	ty: "NumberValue",
	default: number,
	max: number,
	min: number,
	precision: number,
	scale: number,
	step: number,
	type: string,
	unit: string,
}

export interface Unixtime extends Procdesc {
	ty: "UnixtimeValue",
	default: number,
}

export interface PYON extends Procdesc {
	ty: "PYONValue",
}

export interface Scan extends Procdesc {
	ty: "Scannable",
	default: any[], // TODO: any = NoScan | RangeScan | CenterScan | ExplicitScan
	global_max: number,
	global_min: number,
	global_step: number,
	precision: number,
	scale: number,
	unit: number,
}

export interface String extends Procdesc {
	ty: "StringValue",
	default: string,
}