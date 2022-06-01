
import { App, Editor, SuggestModal } from 'obsidian';
import { ZoteroConnector } from './ZoteroConnector';
import { ZoteroItem } from './ZoteroItem';
import { ZoteroPluginSettings } from './ZoteroPluginSettings';

export abstract class ZoteroSearchModal extends SuggestModal<ZoteroItem> {

    connector: ZoteroConnector;
    editor: Editor;
    settings: ZoteroPluginSettings;

    constructor(app: App, connector: ZoteroConnector, editor: Editor, settings: ZoteroPluginSettings) {
        super(app);
        this.connector = connector;
        this.editor = editor;
        this.settings = settings;
    }

    getSuggestions(query: string): Promise<ZoteroItem[]> {
        return this.connector.searchEverything(query);
    }

    renderSuggestion(item: ZoteroItem, el: HTMLElement) {
        el.createEl('div', { text: item.getTitle() });
        el.createEl('small', { text: item.getKey() });
    }

}
