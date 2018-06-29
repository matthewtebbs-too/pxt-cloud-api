export declare type DataDiff = any;
export declare type DataCloner = (value: any, cloner: DataCloner) => any;
export interface DataSource {
    readonly data: any;
    readonly cloner?: DataCloner;
}
export interface SyncedData {
    readonly source: DataSource;
    latest?: any;
}
export declare class DataRepo {
    private _synceddata;
    addDataSource(name: string, source_: DataSource): boolean;
    removeDataSource(name: string): boolean;
    currentlySynced(name: string): any | null;
    syncToData(name: string): DataDiff[] | null;
    applyDiffs(name: string, diff: DataDiff | DataDiff[]): boolean;
}
