import { Editor, Plugin } from 'obsidian';
import { ZoteroConnector } from './ZoteroConnector';
import { ZoteroSearchModalLink } from './ZoteroSearchModalLink';
import { ZoteroSearchModalNote } from './ZoteroSearchModalNote';
import { ZoteroSettingTab } from "./ZoteroSettingTab";
import { DEFAULT_SETTINGS, ZoteroPluginSettings } from './ZoteroPluginSettings';

export class ZoteroPlugin extends Plugin {

    settings: ZoteroPluginSettings;
    zoteroConnector: ZoteroConnector;

    async onload() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

        this.addSettingTab(new ZoteroSettingTab(this.app, this));

        this.addCommand({
            id: 'zotero-insert-link',
            name: 'Insert link',
            editorCallback: (editor: Editor) => {
                new ZoteroSearchModalLink(this.app, this.zoteroConnector, editor, this.settings).open();
            }
        });

        this.addCommand({
            id: 'zotero-insert-note',
            name: 'Insert note',
            editorCallback: (editor: Editor) => {
                new ZoteroSearchModalNote(this.app, this.zoteroConnector, editor, this.settings).open();
            }
        });

        this.init();
    }

    async saveSettings(newSettings: Partial<ZoteroPluginSettings>) {
        this.settings = Object.assign({}, this.settings, newSettings);
        await this.saveData(this.settings);
        // apply new settings
        this.init();
    }

    init() {
        this.zoteroConnector = new ZoteroConnector(this.settings);
    }
}
