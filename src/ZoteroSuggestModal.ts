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
        return this.adapter.search(query);
    }

    renderSuggestion(item: ZoteroItem, el: HTMLElement) {
        const authors = item.getAuthors();
        el.createEl('div', { text: item.getTitle() });

        // author
        if (authors.length > 0) {
            let text = authors[0].fullName + ' ';
            if (authors.length > 1) {
                text += 'et al. '
            }
            el.createEl('small', { text });

            // date
            if (item.getDate()) {
                el.createEl('small', { text: `(${item.getDate().year}) ` });
            }
        }

        el.createEl('small', { text: `[${item.getKey()}]`, cls: 'zotero-bridge__text-secondary' });
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
