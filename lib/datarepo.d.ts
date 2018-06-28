import { DataDiff, DataSource } from './api';
export declare class DataRepo {
    private _synceddata;
    addDataSource(name: string, source_: DataSource): boolean;
    removeDataSource(name: string): boolean;
    currentSynced(name: string): any | undefined;
    syncToData(name: string): DataDiff[] | undefined;
}
