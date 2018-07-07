import * as API from './api';
export declare class DataRepo implements API.DataSyncAPI {
    private _synceddata;
    addDataSource(name: string, source_: API.DataSource): boolean;
    removeDataSource(name: string): boolean;
    currentlySynced(name: string): any;
    syncDataSource(name: string): API.DataDiff[] | null;
    syncDataDiff(name: string, diff_: API.DataDiff[]): API.DataDiff[] | null;
}
