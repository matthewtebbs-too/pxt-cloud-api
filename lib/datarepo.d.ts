import * as API from './api';
export declare class DataRepo {
    static applyDataDiff(current: object, diff_: API.DataDiff[]): void;
    private _synceddata;
    addDataSource(name: string, source: API.DataSource): boolean;
    removeDataSource(name: string): boolean;
    currentlySynced(name: string): object | null;
    calcDataDiff(name: string): API.DataDiff[] | null;
    applyDataDiff(name: string, diff_: API.DataDiff[]): void;
}
