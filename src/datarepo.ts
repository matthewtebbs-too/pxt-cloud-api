
/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

const cloneDeep = require('clone-deep');
import { applyChange, diff } from 'deep-diff';

import * as MsgPack from 'msgpack-lite';

import * as API from './api';

interface SyncedData {
    source?: API.DataSource;
    current?: any;
}

export class DataRepo implements API.DataSyncAPI {
    private _synceddata: { [key: string]: SyncedData } = {};

    public addDataSource(name: string, source_: API.DataSource): boolean {
        const synceddata = this._synceddata[name];
        if (!synceddata) {
            this._synceddata[name] = { source: source_, current: source_.data };
        }

        return !!synceddata;
    }

    public removeDataSource(name: string): boolean {
        return delete this._synceddata[name];
    }

    public currentlySynced(name: string): any {
        const synceddata = this._synceddata[name];
        if (!synceddata) {
            return null;
        }

        return synceddata.current || null;
    }

    public syncDataSource(name: string): API.DataDiff[] | null {
        const synceddata = this._synceddata[name];
        if (!synceddata || !synceddata.source) {
            return null;
        }

        const current = synceddata.source.cloner ? synceddata.source.cloner(synceddata.source.data, cloneDeep) : cloneDeep(synceddata.source.data);
        const diff_ = diff(synceddata.current, current) || [];

        synceddata.current = current;

        return diff_.map(d => MsgPack.encode(d));
    }

    public syncDataDiff(name: string, diff_: API.DataDiff[]): API.DataDiff[] | null {
        let synceddata = this._synceddata[name];
        if (!synceddata) {
            synceddata = this._synceddata[name] = { current: {} };
        }

        const current = synceddata.current;

        diff_.forEach(d => applyChange(synceddata.current, current, MsgPack.decode(d)));

        return diff_;
    }
}
