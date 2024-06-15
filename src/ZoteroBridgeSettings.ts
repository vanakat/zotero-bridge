export enum ZoteroBridgeConnectionType {
    ZotServer = 1,
    LocalAPIV3,
}

export interface ZoteroBridgeSettings {
    connectionType: ZoteroBridgeConnectionType;
    userOrGroup: string;
    host: string;
    port: string;
}

export const DEFAULT_SETTINGS: Partial<ZoteroBridgeSettings> = {
    connectionType: ZoteroBridgeConnectionType.ZotServer,
    userOrGroup: 'users/0', // TODO: hardcoded to the main user
    host: 'localhost',
    port: '23119',
};
