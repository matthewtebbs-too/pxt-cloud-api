
/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

import { applyChange, diff } from 'deep-diff';
import * as Lo from 'lodash';
import * as MsgPack from 'msgpack-lite';

import * as API from './api';

interface SyncedData {
    source: API.DataSource;
    dataRecent?: object;
}

export class DataRepo {
    public static encode(data: any): Buffer {
        return MsgPack.encode(data);
    }

    public static encodeArray(data: any): Buffer[] {
        return data.map((d: any) => DataRepo.encode(d));
    }

    public static decode(buffer: Buffer | Buffer[]): any {
        return Array.isArray(buffer) ? buffer.map(b => DataRepo.decode(b)) : MsgPack.decode(new Uint8Array(buffer));
    }

    public static applyDataDiff(current: object, diff_: API.DataDiff[]): object {
        if (diff_) {
            diff_.forEach(d => applyChange(current, current, d));
        }

        return current;
    }

    public static calcDataDiff(lhs: object, rhs: object, options?: API.DataSourceOptions): API.DataDiff[] {
        const diff_ = diff(lhs, rhs, (path: string[], key: number | string | undefined) =>
            0 === path.length && undefined !== key && options && options.filter ? options.filter(key) : false,
        );

        return diff_ || [];
    }

    private _synceddata: { [key: string]: SyncedData } = {};

    public get names(): string[] {
        return Object.keys(this._synceddata);
    }

    public isDataSource(name: string): boolean {
        return !!this._synceddata[name];
    }

    public setDataSource(name: string, source: API.DataSource): boolean {
        const data = this.getData(name);

        const synceddata = this._synceddata[name];
        if (!synceddata) {
            this._synceddata[name] = { source };
        }

        if (data) {
            this.setData(name, data);
        }

        return !!synceddata;
    }

    public deleteDataSource(name: string): boolean {
        return delete this._synceddata[name];
    }

    public getData(name: string): object | undefined {
        const synceddata = this._synceddata[name];
        if (!synceddata) {
            return;
        }

        return synceddata.source.data;
    }

    public getRecentData(name: string): object | undefined {
        const synceddata = this._synceddata[name];
        if (!synceddata) {
            return;
        }

        return synceddata.dataRecent;
    }

    public calcDataDiff(name: string): API.DataDiff[] | undefined {
        const synceddata = this._synceddata[name];
        if (!synceddata) {
            return;
        }

        const source = synceddata.source;

        const dataRecent = synceddata.dataRecent || {};
        synceddata.dataRecent = Lo.cloneDeep(source.data);

        return DataRepo.calcDataDiff(dataRecent, source.data, source.options);
    }

    public setData(name: string, data: object) {
        this.applyDataDiff(name, DataRepo.calcDataDiff({}, data), true /* reset recent */);
    }

    public applyDataDiff(name: string, diff_: API.DataDiff[], resetRecent: boolean = false) {
        let synceddata = this._synceddata[name];
        if (!synceddata) {
            synceddata = this._synceddata[name] = { source: { data: {} } };
        }

        const source = synceddata.source;

        DataRepo.applyDataDiff(source.data, diff_);

        if (resetRecent) {
            synceddata.dataRecent = Lo.cloneDeep(source.data);
        }
    }
}
