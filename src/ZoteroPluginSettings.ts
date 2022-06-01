export interface ZoteroPluginSettings {
    host: string;
    port: string;
    linkTemplate: string;
    noteDirectory: string;
    noteTitleTemplate: string;
    noteContentTemplate: string;
}

export const DEFAULT_SETTINGS: Partial<ZoteroPluginSettings> = {
    host: 'localhost',
    port: '23119',
    linkTemplate: '{{ title }}',
    noteDirectory: 'Reading notes',
    noteTitleTemplate: '{{ firstAuthor.lastName }}{% if authors | length == 2 %} and {{ (authors | last).lastName }}{% elif authors | length > 2 %}et al.{% endif %} {{ date.year }} {{ title }}',
    noteContentTemplate: "[Open in Zotero](zotero://select/library/items/{{ key }})\n"
};
