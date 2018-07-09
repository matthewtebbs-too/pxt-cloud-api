import * as API from './api';
export declare class DataRepo {
    static applyDataDiff(current: object, diff_: API.DataDiff[]): object;
    private _synceddata;
    addDataSource(name: string, source: API.DataSource): boolean;
    removeDataSource(name: string): boolean;
    currentlySynced(name: string): object | undefined;
    calcDataDiff(name: string): API.DataDiff[] | undefined;
    applyDataDiff(name: string, diff_: API.DataDiff[]): void;
}
