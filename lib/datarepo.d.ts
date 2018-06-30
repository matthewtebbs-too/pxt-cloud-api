/// <reference types="deep-diff" />
export declare type DataDiff = deepDiff.IDiff;
export declare type DataCloner = (value: any, deepclone: DataCloner) => any;
export interface DataSource {
    readonly data: any;
    readonly cloner?: DataCloner;
}
export declare class DataRepo {
    private _synceddata;
    addDataSource(name: string, source_: DataSource): boolean;
    removeDataSource(name: string): boolean;
    currentlySynced(name: string): any | null;
    syncData(name: string): DataDiff[] | null;
    applyDataDiffs(name: string, diff_: DataDiff | DataDiff[]): boolean;
}
