
import { App, Editor, SuggestModal } from 'obsidian';
import Zotero from './Zotero';
import { ZoteroItem } from './ZoteroItem';

export class ZoteroSearchModal extends SuggestModal<ZoteroItem> {

    zotero: Zotero;
    editor: Editor;

    constructor(app: App, zotero: Zotero, editor: Editor) {
        super(app);
        this.zotero = zotero;
        this.editor = editor;
    }

    getSuggestions(query: string): Promise<ZoteroItem[]> {
        return this.zotero.searchEverything(query);
    }

    renderSuggestion(item: ZoteroItem, el: HTMLElement) {
        el.createEl('div', { text: item.getTitle() });
        el.createEl('small', { text: item.getKey() });
    }

    onChooseSuggestion(item: ZoteroItem) {
        this.editor.replaceRange(`[${item.getTitle()}](zotero://select/library/items/${item.getKey()})`, this.editor.getCursor());
    }
}
