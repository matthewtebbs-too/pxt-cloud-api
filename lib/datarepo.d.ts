/// <reference types="node" />
export declare type DataDiff = Buffer;
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
    syncDataSource(name: string): DataDiff[] | null;
    syncDataDiff(name: string, diff_: DataDiff[]): void;
}
