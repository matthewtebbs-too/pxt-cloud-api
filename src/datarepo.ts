
/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

const cloneDeep = require('clone-deep');
import * as DiffDeep from 'deep-diff';

export type DataDiff = any;

export type DataCloner = (value: any, cloner: DataCloner) => any;

export interface DataSource {
    readonly data: any;
    readonly cloner?: DataCloner;
}

export interface SyncedData {
    readonly source: DataSource;
    latest?: any;
}

export class DataRepo {
    private _synceddata: { [key: string]: SyncedData } = {};

    public addDataSource(name: string, source_: DataSource): boolean {
        const data = this._synceddata[name];
        if (!data) {
            this._synceddata[name] = { source: source_ };
        }

        return !!data;
    }

    public removeDataSource(name: string): boolean {
        return delete this._synceddata[name];
    }

    public currentlySynced(name: string): any | null {
        const data = this._synceddata[name];
        if (!data) {
            return null;
        }

        return data.latest || null;
    }

    public syncData(name: string): DataDiff[] | null {
        const data = this._synceddata[name];
        if (!data) {
            return null;
        }

        const latest = data.source.cloner ? data.source.cloner(data.source, cloneDeep) : cloneDeep(data.source);
        const diff_ = DiffDeep.diff(data.latest || {}, latest) || [];

        data.latest = latest;

        return diff_;
    }

    public applyDiffs(name: string, diff: DataDiff | DataDiff[]): boolean {
        const data = this._synceddata[name];
        if (!data) {
            return false;
        }

        if (Array.isArray(diff)) {
            diff.forEach(diff_ => DiffDeep.applyChange(data.latest, data.latest, diff_));
        } else {
            DiffDeep.applyChange(data.latest, data.latest, diff);
        }

        return true;
    }
}
