import {Plugin} from 'obsidian';
import {registerAPI} from '@vanakat/plugin-api';
import {DEFAULT_SETTINGS, ZoteroBridgeSettings} from './ZoteroBridgeSettings';
import {ZoteroConnector} from './ZoteroConnector';
import {ZoteroBridgeApi} from "./ZoteroBridgeApi";

/** @public */
export class ZoteroBridge extends Plugin {

    settings: ZoteroBridgeSettings;
    zoteroConnector: ZoteroConnector;

    async onload() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        this.zoteroConnector = new ZoteroConnector(this.settings);

        registerAPI('ZoteroBridge', new ZoteroBridgeApi(this), this);
    }

    async saveSettings(newSettings: Partial<ZoteroBridgeSettings>) {
        Object.assign(this.settings, newSettings);
        await this.saveData(this.settings);
    }
}
