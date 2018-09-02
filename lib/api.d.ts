export declare enum Events {
    ChatNewMessage = "new message",
    UserAddSelf = "add self",
    UserLeft = "user left",
    UserJoined = "user joined",
    UserRemoveSelf = "remove self",
    UserSelfInfo = "self info",
    WorldPullAllData = "pull all data",
    WorldPullData = "pull data",
    WorldPushAllData = "push all data",
    WorldPushData = "push data",
    WorldPushDataDiff = "push data diff",
    WorldLockData = "lock data",
    WorldUnlockData = "unlock data"
}
export interface CommonAPI {
    isConnected: boolean;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
}
export declare type UserId = string;
export interface UserData {
    readonly name: string;
    readonly id?: UserId;
}
export interface UsersAPI extends CommonAPI {
    selfInfo(): PromiseLike<UserData>;
    addSelf(user: UserData): PromiseLike<boolean>;
    removeSelf(): PromiseLike<boolean>;
}
export interface MessageData {
    readonly text: string;
    readonly name?: string;
}
export interface ChatAPI extends CommonAPI {
    newMessage(msg: string | MessageData): PromiseLike<boolean>;
}
export declare type Data = object;
export declare type DataDiff = any;
export declare type DataFilter = (key: number | string | undefined, value?: any) => boolean;
export interface DataSourceOptions {
    filter?: DataFilter;
}
export interface DataSource {
    readonly data: object;
    readonly options?: DataSourceOptions;
}
export interface Tagged<T> {
    readonly name: string;
    readonly data: T;
}
export interface WorldAPI extends CommonAPI {
    syncDataSources(): PromiseLike<boolean>;
    setDataSource(name: string, source?: DataSource): boolean;
    deleteDataSource(name: string): boolean;
    pullData(name: string): PromiseLike<Array<Tagged<Data>> | Data | undefined>;
    pushData(name: string, unlock?: boolean): PromiseLike<void>;
    pushDataDiff(name: string, diff: DataDiff[] | undefined, unlock?: boolean): PromiseLike<void>;
    lockData(name: string): PromiseLike<boolean>;
    unlockData(name: string): PromiseLike<boolean>;
    deleteData(name: string): PromiseLike<void>;
}
export interface PublicAPI {
    readonly chat: ChatAPI;
    readonly users: UsersAPI;
    readonly world: WorldAPI;
}
