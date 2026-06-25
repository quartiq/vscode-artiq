import { Dict } from "sipyco/pyon";

export type Keypath = string;
export type Metadata = { unit: string, scale: number, precision: number };
export type Dataset = [ persist: boolean, value: any, metadata: Metadata ];
export type Datasets = Dict<Keypath, Dataset>;