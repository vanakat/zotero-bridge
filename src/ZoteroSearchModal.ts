
import { App, Editor, SuggestModal } from 'obsidian';
import { ZoteroConnector } from './ZoteroConnector';
import { ZoteroItem } from './ZoteroItem';

export class ZoteroSearchModal extends SuggestModal<ZoteroItem> {

    connector: ZoteroConnector;
    editor: Editor;

    constructor(app: App, connector: ZoteroConnector, editor: Editor) {
        super(app);
        this.connector = connector;
        this.editor = editor;
    }

    getSuggestions(query: string): Promise<ZoteroItem[]> {
        return this.connector.searchEverything(query);
    }

    renderSuggestion(item: ZoteroItem, el: HTMLElement) {
        el.createEl('div', { text: item.getTitle() });
        el.createEl('small', { text: item.getKey() });
    }

    onChooseSuggestion(item: ZoteroItem) {
        this.editor.replaceRange(item.getLink(), this.editor.getCursor());
    }
}
