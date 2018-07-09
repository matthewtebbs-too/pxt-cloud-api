
/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

const cloneDeep = require('clone-deep');
import { applyChange, diff } from 'deep-diff';

import * as MsgPack from 'msgpack-lite';

import * as API from './api';

interface SyncedData {
    current: object;
    source?: API.DataSource;
}

export class DataRepo {
    public static applyDataDiff(current: object, diff_: API.DataDiff[]): object {
        diff_.forEach(d => applyChange(current, current, MsgPack.decode(d)));

        return current;
    }

    public static calcDataDiff(lhs: object, rhs: object): API.DataDiff[] {
        const diff_ = diff(lhs, rhs) || [];

        return diff_.map(d => MsgPack.encode(d));
    }

    protected static _cloneSourceData(source: API.DataSource): object {
        return source.cloner ? source.cloner(source.data, cloneDeep) : cloneDeep(source.data);
    }

    private _synceddata: { [key: string]: SyncedData } = {};

    public addDataSource(name: string, source: API.DataSource): boolean {
        const synceddata = this._synceddata[name];
        if (!synceddata) {
            this._synceddata[name] = { source, current: DataRepo._cloneSourceData(source) };
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

        const current = DataRepo._cloneSourceData(synceddata.source);
        const diff_ = DataRepo.calcDataDiff(synceddata.current, current);

        synceddata.current = current;

        return diff_;
    }

    public applyDataDiff(name: string, diff_: API.DataDiff[]) {
        let synceddata = this._synceddata[name];
        if (!synceddata) {
            synceddata = this._synceddata[name] = { current: {} };
        }

        DataRepo.applyDataDiff(synceddata.current, diff_);
    }
}
