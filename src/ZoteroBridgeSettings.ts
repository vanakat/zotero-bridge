export interface ZoteroBridgeSettings {
    host: string;
    port: string;
}

export const DEFAULT_SETTINGS: Partial<ZoteroBridgeSettings> = {
    host: 'localhost',
    port: '23119',
};
