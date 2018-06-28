
/*
    MIT License

    Copyright (c) 2018 MuddyTummy Software LLC
*/

export enum Events {
    ChatNewMessage = 'new message',
    UserAddSelf = 'add self',
    UserLeft = 'user left',
    UserJoined = 'user joined',
    UserRemoveSelf = 'remove self',
    UserSelfInfo = 'self info',
}

export interface CommonAPI {
    isConnected: boolean;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
}

export type UserId = string;

export interface UserData {
    readonly name: string;

    readonly id?: UserId;   /* reply only */
}

export interface UsersAPI extends CommonAPI {
    selfInfo(): PromiseLike<UserData>;
    addSelf(user: UserData): PromiseLike<boolean>;
    removeSelf(): PromiseLike<boolean>;
}

export interface MessageData {
    readonly text: string;

    readonly name?: string; /* reply only */
}

export interface ChatAPI extends CommonAPI {
    newMessage(msg: string | MessageData): PromiseLike<void>;
}

export type DataDiff = any;

export type DataCloner = (value: any, cloner: DataCloner) => any;

export interface DataSource {
    readonly data: any;
    readonly cloner?: DataCloner;
}

export interface SyncedData {
    readonly source: DataSource;
    timestamp?: string;
    latest?: any;
}

export interface WorldAPI extends CommonAPI {
    addSyncedData(name: string, source_: DataSource): boolean;
    removeSyncedData(name: string): boolean;
    syncData(name: string): Promise<string[]>;
    syncDiff(name: string, diff: DataDiff[]): PromiseLike<string[]>;
}

export interface PublicAPI {
    readonly chat: ChatAPI;    /* namespace is '/pxt-cloud/chat' */
    readonly users: UsersAPI;  /* namespace is '/pxt-cloud/users' */
    readonly world: WorldAPI;  /* namespace is '/pxt-cloud/world' */
}
