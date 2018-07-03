import { DataSource } from './datarepo';
export declare enum Events {
    ChatNewMessage = "new message",
    UserAddSelf = "add self",
    UserLeft = "user left",
    UserJoined = "user joined",
    UserRemoveSelf = "remove self",
    UserSelfInfo = "self info",
    WorldSyncDiff = "sync diff"
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
export interface WorldAPI extends CommonAPI {
    addDataSource(name: string, source_?: DataSource): boolean;
    removeDataSource(name: string): boolean;
    syncData(name: string): PromiseLike<string[]>;
    syncDiff(name: string, diff: any): PromiseLike<string[]>;
}
export interface PublicAPI {
    readonly chat: ChatAPI;
    readonly users: UsersAPI;
    readonly world: WorldAPI;
}
