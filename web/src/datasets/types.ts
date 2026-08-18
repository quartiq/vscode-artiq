import { TaggedDict } from "sipyco/pyon";
import { Store as SyncStructStore } from "sipyco/sync_struct";

export type Keypath = string;
export type Metadata = { unit: string, scale: number, precision: number };
export type Dataset = [ persist: boolean, value: any, metadata: Metadata ];
export type Datasets = TaggedDict<Keypath, Dataset>;
export type Store = SyncStructStore & { struct: Datasets };