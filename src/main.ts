import { Editor, MarkdownView, Plugin } from 'obsidian';
import Zotero from './Zotero';
import { ZoteroSearchModal } from './ZoteroSearchModal';

export default class ZoteroPlugin extends Plugin {

    zotero: any;

    async onload() {
        this.zotero = new Zotero();

        // This adds a simple command that can be triggered anywhere
        this.addCommand({
            id: 'zotero-insert-link',
            name: 'Insert link',
            callback: () => {
                new ZoteroSearchModal(this.app, this.zotero).open();
            }
        });
        // This adds an editor command that can perform some operation on the current editor instance
        this.addCommand({
            id: 'sample-editor-command',
            name: 'Sample editor command',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                console.log(editor.getSelection());
                editor.replaceSelection('Sample Editor Command');
            }
        });
    }

    onunload() {

    }
}
