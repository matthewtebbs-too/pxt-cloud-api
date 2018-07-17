/// <reference types="node" />
import * as API from './api';
export declare class DataRepo {
    static encode(data: any): Buffer;
    static decode(buffer: Buffer): any;
    static applyDataDiff(current: object, diff_: API.DataDiff[]): object;
    static calcDataDiff(lhs: object, rhs: object, options?: API.DataSourceOptions): API.DataDiff[];
    static filteredData(current: object, options?: API.DataSourceOptions): object;
    private _synceddata;
    isDataSource(name: string): boolean;
    setDataSource(name: string, source: API.DataSource): boolean;
    deleteDataSource(name: string): boolean;
    getData(name: string): object | undefined;
    calcDataDiff(name: string): API.DataDiff[] | undefined;
    setData(name: string, data: object): void;
    applyDataDiff(name: string, diff_: API.DataDiff[]): void;
}
