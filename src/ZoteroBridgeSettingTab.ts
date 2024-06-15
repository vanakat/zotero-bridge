import { ZoteroBridge } from './ZoteroBridge';
import { ZoteroBridgeConnectionType } from './ZoteroBridgeSettings'
import { App, PluginSettingTab, Setting } from 'obsidian';

export class ZoteroBridgeSettingTab extends PluginSettingTab {
    plugin: ZoteroBridge;

    constructor(app: App, plugin: ZoteroBridge) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        this.containerEl.empty();

        new Setting(this.containerEl)
            .setName('Connection type')
            .addDropdown(dropdown => {
                dropdown
                    .addOption(ZoteroBridgeConnectionType.ZotServer.toString(), 'ZotServer Plugin')
                    .addOption(ZoteroBridgeConnectionType.LocalAPIV3.toString(), 'Zotero 7 Local API (v3)')
                    .setValue(this.plugin.settings.connectionType.toString())
                    .onChange(async (value) => {
                        await this.plugin.saveSettings({
                            connectionType: +value
                        });
                    })
            });
    }
}
