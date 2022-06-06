import {promisedZoteroSuggestModal} from '../ZoteroSuggestModal';
import {ZoteroBridge} from '../ZoteroBridge';

export class ZoteroBridgeApiV1 {

    plugin: ZoteroBridge;

    constructor(plugin: ZoteroBridge) {
        this.plugin = plugin;
    }

    search() {
        return promisedZoteroSuggestModal(this.plugin.app, this.plugin.zoteroConnector);
    }

}
