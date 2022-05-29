export interface ZoteroPluginSettings {
    host: string;
    port: string;
    linkTemplate: string;
}

export const DEFAULT_SETTINGS: Partial<ZoteroPluginSettings> = {
    host: 'localhost',
    port: '23119',
    linkTemplate: '{{ title }}',
};
