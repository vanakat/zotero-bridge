
import { App, Notice, SuggestModal } from 'obsidian';

interface Reference {
    key: string;
    title: string;
    itemType: string;
}

export class ZoteroSearchModal extends SuggestModal<Reference> {

    zotero: any;

    constructor(app: App, zotero: any) {
        super(app);
        this.zotero = zotero;
    }


    getSuggestions(query: string): Reference[] {
        this.zotero.searchEverything(query).then(console.log)
        return this.zotero.searchEverything(query);
    }

    // Renders each suggestion item.
    renderSuggestion(book: Reference, el: HTMLElement) {
        el.createEl('div', { text: book.title });
        el.createEl('small', { text: book.key });
    }

    // Perform action on the selected suggestion.
    onChooseSuggestion(book: Reference, evt: MouseEvent | KeyboardEvent) {
        new Notice(`Selected ${book.title}`);
    }
}
