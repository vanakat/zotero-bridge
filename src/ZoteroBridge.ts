import {Plugin} from 'obsidian';
import {registerAPI} from '@vanakat/plugin-api';
import {DEFAULT_SETTINGS, ZoteroBridgeSettings} from './ZoteroBridgeSettings';
import { ZoteroAdapter } from './ZoteroAdapter';
import {ZoteroBridgeApi} from "./ZoteroBridgeApi";

/** @public */
export class ZoteroBridge extends Plugin {

    settings: ZoteroBridgeSettings;
    zoteroAdapter: ZoteroAdapter;

    async onload() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        this.zoteroAdapter = new ZoteroAdapter(this.settings);

        registerAPI('ZoteroBridge', new ZoteroBridgeApi(this), this);
    }

    async saveSettings(newSettings: Partial<ZoteroBridgeSettings>) {
        Object.assign(this.settings, newSettings);
        await this.saveData(this.settings);
    }
}
