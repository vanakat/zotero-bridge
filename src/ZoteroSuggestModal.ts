import { App, SuggestModal } from 'obsidian';
import { ZoteroAdapter } from './ZoteroAdapter';
import { ZoteroItem } from './ZoteroItem';

export class ZoteroSuggestModal extends SuggestModal<ZoteroItem> {

    adapter: ZoteroAdapter;
    onSelect: any;

    constructor(app: App, adapter: ZoteroAdapter, onSelect: any) {
        super(app);
        this.adapter = adapter;
        this.onSelect = onSelect;
    }

    getSuggestions(query: string): Promise<ZoteroItem[]> {
        return this.adapter.searchEverything(query);
    }

    renderSuggestion(item: ZoteroItem, el: HTMLElement) {
        el.createEl('div', { text: item.getTitle() });
        el.createEl('small', { text: item.getKey() });
    }

    onChooseSuggestion(item: ZoteroItem) {
        this.onSelect(item);
    }
}

export function promisedZoteroSuggestModal(...args: [App, ZoteroAdapter]): Promise<ZoteroItem> {
    return new Promise((resolve, reject) => {
        try {
            new ZoteroSuggestModal(...args, (item: ZoteroItem) => resolve(item)).open();
        } catch (e) {
            reject(e);
        }
    });
}
