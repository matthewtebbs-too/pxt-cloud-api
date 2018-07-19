/// <reference types="node" />
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
    WorldPushDataDiff = "push data diff"
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
export declare type DataDiff = Buffer;
export declare type DataFilter = (key: number | string | undefined, value?: any) => boolean;
export interface DataSourceOptions {
    filter?: DataFilter;
}
export interface DataSource {
    readonly data: object;
    readonly options?: DataSourceOptions;
}
export interface NamedData {
    readonly name: string;
    readonly data: object;
}
export interface WorldAPI extends CommonAPI {
    setDataSource(name: string, source_?: DataSource): boolean;
    deleteDataSource(name: string): boolean;
    pullAllData(): PromiseLike<NamedData[]>;
    pullData(name: string): PromiseLike<object | undefined>;
    pushAllData(): PromiseLike<void>;
    pushData(name: string): PromiseLike<void>;
    pushDataDiff(name: string, diff: DataDiff[]): PromiseLike<void>;
}
export interface PublicAPI {
    readonly chat: ChatAPI;
    readonly users: UsersAPI;
    readonly world: WorldAPI;
}
