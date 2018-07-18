
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

    WorldSyncData = 'sync data',
    WorldSyncDataDiff = 'sync data diff',
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
    newMessage(msg: string | MessageData): PromiseLike<boolean>;
}

export type DataDiff = Buffer; /* packed (opaque) deep-diff IDiff structure, see https://github.com/flitbit/diff */

export type DataFilter = (key: number | string | undefined, value?: any) => boolean; /* top-level keys prefilter callback */

export interface DataSourceOptions {
    filter?: DataFilter;
}

export interface DataSource {
    readonly data: object;
    readonly options?: DataSourceOptions;
}

export interface WorldAPI extends CommonAPI {
    setDataSource(name: string, source_?: DataSource): boolean;
    deleteDataSource(name: string): boolean;

    pullAllData(): PromiseLike<[object]>;
    pullData(name: string): PromiseLike<object | undefined>;

    pushAllData(): PromiseLike<void>;
    pushData(name: string): PromiseLike<void>;
    pushDataDiff(name: string, diff: DataDiff[]): PromiseLike<void>;
}

export interface PublicAPI {
    readonly chat: ChatAPI;    /* namespace is '/pxt-cloud/chat' */
    readonly users: UsersAPI;  /* namespace is '/pxt-cloud/users' */
    readonly world: WorldAPI;  /* namespace is '/pxt-cloud/world' */
}
