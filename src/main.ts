import { Editor, Plugin } from 'obsidian';
import Zotero from './Zotero';
import { ZoteroSearchModal } from './ZoteroSearchModal';

export default class ZoteroPlugin extends Plugin {

    zotero: Zotero;

    async onload() {
        this.zotero = new Zotero();

        this.addCommand({
            id: 'zotero-insert-link',
            name: 'Insert link',
            editorCallback: (editor: Editor) => {
                new ZoteroSearchModal(this.app, this.zotero, editor).open();
            }
        });
    }
}
