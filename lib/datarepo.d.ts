/// <reference types="node" />
import * as API from './api';
export declare class DataRepo {
    static encode(data: any): Buffer;
    static decode(buffer: Buffer): any;
    static applyDataDiff(current: object, diff_: API.DataDiff[]): object;
    static calcDataDiff(lhs: object, rhs: object): API.DataDiff[];
    protected static _cloneSourceData(source: API.DataSource): object;
    private _synceddata;
    isDataSource(name: string): boolean;
    setDataSource(name: string, source: API.DataSource): boolean;
    removeDataSource(name: string): boolean;
    getData(name: string): object | undefined;
    calcDataDiff(name: string): API.DataDiff[] | undefined;
    setData(name: string, data: object): void;
    applyDataDiff(name: string, diff_: API.DataDiff[]): void;
}
