
/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

import { applyChange, diff } from 'deep-diff';
import * as Lo from 'lodash';
import * as MsgPack from 'msgpack-lite';

import * as API from './api';

// tslint:disable

interface SyncedData {
    source: API.DataSource;
    dataRecent?: object;
}

export class DataRepo {
    public static encode(data: any): Buffer {
        return MsgPack.encode(data);
    }

    public static decode(buffer: Buffer): any {
        return MsgPack.decode(buffer);
    }

    public static applyDataDiff(current: object, diff_: API.DataDiff[]): object {
        if (diff_) {
            diff_.forEach(d => applyChange(current, current, DataRepo.decode(d)));
        }

        return current;
    }

    public static calcDataDiff(lhs: object, rhs: object, options?: API.DataSourceOptions): API.DataDiff[] {
        const diff_ = diff(lhs, rhs, options ? options.filter : undefined);

        return diff_ ? diff_.map(d => DataRepo.encode(d)) : [];
    }

    public static cloneData(current: object, options?: API.DataSourceOptions): object {
        const objStack: object[] = [];
        const path: string[] = [];

        return Lo.cloneDeepWith(current, (value: any, key: number | string | undefined, object: any | undefined) => {
            const isObject = Lo.isObject(value);

            if (undefined !== key) {
                for (;;) {
                    let top = Lo.last(objStack);
                    if (!top || top.hasOwnProperty(key)) {
                        break;
                    }
                    path.pop(); objStack.pop();
                }

                if (options && options.filter) {
                    options.filter(path, key);
                }

                if (isObject) {
                    path.push(key.toString());
                    objStack.push(value);
                } 
            }

            let valueClone;

            if (isObject) {
                if (options && options.cloner) {
                    valueClone = options.cloner(value) 
                }
            }

            return valueClone;
        });
    }

    private _synceddata: { [key: string]: SyncedData } = {};

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
            return undefined;
        }

        return synceddata.source.data;
    }

    public calcDataDiff(name: string): API.DataDiff[] | undefined {
        const synceddata = this._synceddata[name];
        if (!synceddata) {
            return undefined;
        }

        const source = synceddata.source;

        const dataRecent = synceddata.dataRecent || {};
        synceddata.dataRecent = DataRepo.cloneData(source.data, source.options);

        return DataRepo.calcDataDiff(dataRecent, source.data, source.options);
    }

    public setData(name: string, data: object) {
        this.applyDataDiff(name, DataRepo.calcDataDiff({}, data));
    }

    public applyDataDiff(name: string, diff_: API.DataDiff[]) {
        let synceddata = this._synceddata[name];
        if (!synceddata) {
            synceddata = this._synceddata[name] = { source: { data: {} } };
        }

        DataRepo.applyDataDiff(synceddata.source.data, diff_);
    }
}
