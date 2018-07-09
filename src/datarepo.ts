
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
    current: object;
}

export class DataRepo {
    public static applyDataDiff(current: object, diff_: API.DataDiff[]) {
        diff_.forEach(d => applyChange(current, current, MsgPack.decode(d)));
    }

    private _synceddata: { [key: string]: SyncedData } = {};

    public addDataSource(name: string, source: API.DataSource): boolean {
        const synceddata = this._synceddata[name];
        if (!synceddata) {
            this._synceddata[name] = { source, current: source.data };
        }

        return !!synceddata;
    }

    public removeDataSource(name: string): boolean {
        return delete this._synceddata[name];
    }

    public currentlySynced(name: string): object | undefined {
        const synceddata = this._synceddata[name];
        if (!synceddata || !synceddata.current) {
            return undefined;
        }

        return synceddata.current;
    }

    public calcDataDiff(name: string): API.DataDiff[] | undefined {
        const synceddata = this._synceddata[name];
        if (!synceddata || !synceddata.source) {
            return undefined;
        }

        const current = synceddata.source.cloner ? synceddata.source.cloner(synceddata.source.data, cloneDeep) : cloneDeep(synceddata.source.data);
        const diff_ = diff(synceddata.current, current) || [];

        synceddata.current = current;

        return diff_.map(d => MsgPack.encode(d));
    }

    public applyDataDiff(name: string, diff_: API.DataDiff[]) {
        let synceddata = this._synceddata[name];
        if (!synceddata) {
            synceddata = this._synceddata[name] = { current: {} };
        }

        DataRepo.applyDataDiff(synceddata.current, diff_);
    }
}
