
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

    WorldPullAllData = 'pull all data',
    WorldPullData = 'pull data', /* NYI */

    WorldPushAllData = 'push all data',
    WorldPushData = 'push data',
    WorldPushDataDiff = 'push data diff',

    WorldLockData = 'lock data',
    WorldUnlockData = 'unlock data',
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

export type Data = object; /* data object */
export type DataDiff = any; /* deep-diff IDiff object, see https://github.com/flitbit/diff */

export type DataFilter = (key: number | string | undefined, value?: any) => boolean; /* top-level keys prefilter callback */

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

    pullAllData(): PromiseLike<Array<Tagged<Data>>>;
    pullData(name: string): PromiseLike<Data | undefined>;

    pushAllData(unlock?: boolean): PromiseLike<void>;
    pushData(name: string, unlock?: boolean): PromiseLike<void>;
    pushDataDiff(name: string, diff: DataDiff[] | undefined, unlock?: boolean): PromiseLike<void>;

    lockData(name: string): PromiseLike<boolean>;
    unlockData(name: string): PromiseLike<boolean>;
}

export interface PublicAPI {
    readonly chat: ChatAPI;    /* namespace is '/pxt-cloud/chat' */
    readonly users: UsersAPI;  /* namespace is '/pxt-cloud/users' */
    readonly world: WorldAPI;  /* namespace is '/pxt-cloud/world' */
}
