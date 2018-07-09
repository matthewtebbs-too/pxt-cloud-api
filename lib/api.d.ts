/// <reference types="node" />
export declare enum Events {
    ChatNewMessage = "new message",
    UserAddSelf = "add self",
    UserLeft = "user left",
    UserJoined = "user joined",
    UserRemoveSelf = "remove self",
    UserSelfInfo = "self info",
    WorldSyncDataDiff = "sync data diff"
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
    newMessage(msg: string | MessageData): PromiseLike<void>;
}
export declare type DataDiff = Buffer;
export declare type DataCloner = (value: any, deepclone: DataCloner) => any;
export interface DataSource {
    readonly data: any;
    readonly cloner?: DataCloner;
}
export interface DataSyncAPI {
    addDataSource(name: string, source_?: DataSource): boolean;
    removeDataSource(name: string): boolean;
    currentlySynced(name: string): any;
    syncDataSource(name: string): PromiseLike<void> | DataDiff[] | null;
    syncDataDiff(name: string, diff: DataDiff[]): PromiseLike<void> | DataDiff[] | null;
}
export interface WorldAPI extends DataSyncAPI, CommonAPI {
}
export interface PublicAPI {
    readonly chat: ChatAPI;
    readonly users: UsersAPI;
    readonly world: WorldAPI;
}
