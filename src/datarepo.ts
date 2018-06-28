
/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

// tslint:disable-next-line:variable-name
const cloneDeep = require('clone-deep');
const diff = require('deep-diff');

import { DataDiff, DataSource, SyncedData } from './api';

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

    public currentSynced(name: string): any | undefined {
        const data = this._synceddata[name];
        if (!data) {
            return;
        }

        return data.latest;
    }

    public syncToData(name: string): DataDiff[] | undefined {
        const data = this._synceddata[name];
        if (!data) {
            return;
        }

        const latest = data.source.cloner ? data.source.cloner(data.source, cloneDeep) : cloneDeep(data.source);
        const diff_ = diff(data.latest || {}, latest);
        if (!diff_) {
            return;
        }

        data.latest = latest;
        return diff_;
    }
}
