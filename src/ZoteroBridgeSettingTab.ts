import { LocalAPIV3Adapter } from './ZoteroAdapter';
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
            .setDesc('Note that you either need to install ZotServer plugin in Zotero 6 or enable Local API support in Zotero 7 advanced settings.')
            .addDropdown(dropdown => {
                dropdown
                    .addOption(ZoteroBridgeConnectionType.ZotServer.toString(), 'Zotero 6 ZotServer Plugin')
                    .addOption(ZoteroBridgeConnectionType.LocalAPIV3.toString(), 'Zotero 7 Local API (v3)')
                    .setValue(this.plugin.settings.connectionType.toString())
                    .onChange(async (value) => {
                        await this.plugin.saveSettings({
                            connectionType: +value
                        });
                    })
            });

        new Setting(this.containerEl)
            .setName('User or group')
            .setDesc('This parameter only works with Zotero 7 connection type.')
            .addDropdown(async dropdown => {
                const adapter = new LocalAPIV3Adapter(this.plugin.settings);
                const groups = await adapter.groups()

                dropdown.addOption(`users/0`, 'My Library')

                groups.forEach(group => {
                    dropdown.addOption(`groups/${group.id}`, group.name)
                })

                dropdown.setValue(this.plugin.settings.userOrGroup)
                    .onChange(async (value) => {
                        await this.plugin.saveSettings({
                            userOrGroup: value
                        });
                    })
            });

        new Setting(this.containerEl)
            .setName('Zotero server port')
            .setDesc(`Don't change unless you really know what you are doing`)
            .addText(txt => {
                txt.setValue(this.plugin.settings.port.toString())
                    .onChange(async (value) => {
                        await this.plugin.saveSettings({
                            port: value
                        });
                    })
            });
    }
}
