import {Plugin} from 'obsidian';
import {registerAPI} from '@vanakat/plugin-api';
import {DEFAULT_SETTINGS, ZoteroBridgeSettings} from './ZoteroBridgeSettings';
import { ZoteroAdapter, ZoteroAdapters } from './ZoteroAdapter';
import {ZoteroBridgeApi} from "./ZoteroBridgeApi";
import { ZoteroBridgeSettingTab } from './ZoteroBridgeSettingTab';

/** @public */
export class ZoteroBridge extends Plugin {

    settings: ZoteroBridgeSettings;
    zoteroAdapter: ZoteroAdapter;

    async onload() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        this.zoteroAdapter = new ZoteroAdapters[this.settings.connectionType](this.settings);

        this.addSettingTab(new ZoteroBridgeSettingTab(this.app, this));

        registerAPI('ZoteroBridge', new ZoteroBridgeApi(this), this);
    }

    async saveSettings(newSettings: Partial<ZoteroBridgeSettings>) {
        Object.assign(this.settings, newSettings);
        await this.saveData(this.settings);
    }
}
