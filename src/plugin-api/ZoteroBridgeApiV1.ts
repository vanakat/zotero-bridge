import {promisedZoteroSuggestModal} from '../ZoteroSuggestModal';
import {ZoteroBridge} from '../ZoteroBridge';

/**
 * Version 1 of Zotero Bridge API
 * exposed to other Obsidian plugins
 */
export class ZoteroBridgeApiV1 {

    plugin: ZoteroBridge;

    constructor(plugin: ZoteroBridge) {
        this.plugin = plugin;
    }

    search() {
        return promisedZoteroSuggestModal(this.plugin.app, this.plugin.zoteroAdapter);
    }

}
