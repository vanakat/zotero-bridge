import { App, SuggestModal } from 'obsidian';
import { ZoteroConnector } from './ZoteroConnector';
import { ZoteroItem } from './ZoteroItem';

export class ZoteroSuggestModal extends SuggestModal<ZoteroItem> {

    connector: ZoteroConnector;
    onSelect: any;

    constructor(app: App, connector: ZoteroConnector, onSelect: any) {
        super(app);
        this.connector = connector;
        this.onSelect = onSelect;
    }

    getSuggestions(query: string): Promise<ZoteroItem[]> {
        return this.connector.searchEverything(query);
    }

    renderSuggestion(item: ZoteroItem, el: HTMLElement) {
        el.createEl('div', { text: item.getTitle() });
        el.createEl('small', { text: item.getKey() });
    }

    onChooseSuggestion(item: ZoteroItem) {
        this.onSelect(item);
    }
}

export function promisedZoteroSuggestModal(...args: [App, ZoteroConnector]): Promise<ZoteroItem> {
    return new Promise((resolve, reject) => {
        try {
            new ZoteroSuggestModal(...args, (item: ZoteroItem) => resolve(item)).open();
        } catch (e) {
            reject(e);
        }
    });
}
