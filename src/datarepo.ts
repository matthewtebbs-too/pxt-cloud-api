
/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

const cloneDeep = require('clone-deep');
import { applyChange, diff } from 'deep-diff';

export type DataDiff = deepDiff.IDiff;

export type DataCloner = (value: any, deepclone: DataCloner) => any;

export interface DataSource {
    readonly data: any;
    readonly cloner?: DataCloner;
}

interface SyncedData {
    readonly source: DataSource;
    current: any;
}

export class DataRepo {
    private _synceddata: { [key: string]: SyncedData } = {};

    public addDataSource(name: string, source_: DataSource): boolean {
        const synceddata = this._synceddata[name];
        if (!synceddata) {
            this._synceddata[name] = { source: source_, current: source_.data };
        }

        return !!synceddata;
    }

    public removeDataSource(name: string): boolean {
        return delete this._synceddata[name];
    }

    public currentlySynced(name: string): any | null {
        const synceddata = this._synceddata[name];
        if (!synceddata) {
            return null;
        }

        return synceddata.current || null;
    }

    public syncData(name: string): DataDiff[] | null {
        const synceddata = this._synceddata[name];
        if (!synceddata) {
            return null;
        }

        const current = synceddata.source.cloner ? synceddata.source.cloner(synceddata.source.data, cloneDeep) : cloneDeep(synceddata.source.data);
        const diff_ = diff(synceddata.current, current) || [];

        synceddata.current = current;

        return diff_;
    }

    public applyDataDiffs(name: string, diff_: DataDiff | DataDiff[]): boolean {
        const synceddata = this._synceddata[name];
        if (!synceddata) {
            return false;
        }

        if (Array.isArray(diff_)) {
            diff_.forEach(item => applyChange(synceddata.current, synceddata.current, item));
        } else {
            applyChange(synceddata.current, synceddata.current, diff_);
        }

        return true;
    }
}
