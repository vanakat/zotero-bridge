import {Editor, Plugin} from 'obsidian';
import {ZoteroItem} from "./ZoteroItem";
import {ZoteroConnector} from './ZoteroConnector';
import {ZoteroSettingTab} from "./ZoteroSettingTab";
import {promisedZoteroSearchModal} from './ZoteroSearchModal';
import {DEFAULT_SETTINGS, ZoteroPluginSettings} from './ZoteroPluginSettings';

export class ZoteroPlugin extends Plugin {

    settings: ZoteroPluginSettings;
    zoteroConnector: ZoteroConnector;

    async onload() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

        this.addSettingTab(new ZoteroSettingTab(this.app, this));

        this.addCommand({
            id: 'zotero-insert-link',
            name: 'Insert link',
            editorCallback: async (editor: Editor) => {
                promisedZoteroSearchModal(this.app, this.zoteroConnector).then((item: ZoteroItem) => {
                    editor.replaceRange(item.getLink(), editor.getCursor());
                })
            }
        });

        this.zoteroConnector = new ZoteroConnector(this.settings);
    }

    async saveSettings(newSettings: Partial<ZoteroPluginSettings>) {
        Object.assign(this.settings, newSettings);
        await this.saveData(this.settings);
    }
}
