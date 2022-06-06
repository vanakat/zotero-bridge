import {ZoteroBridge} from './ZoteroBridge';
import {ZoteroBridgeApiV1} from './plugin-api/ZoteroBridgeApiV1';

export class ZoteroBridgeApi {

    plugin: ZoteroBridge;

    constructor(plugin: ZoteroBridge) {
        this.plugin = plugin;
    }

    v1() {
        return new ZoteroBridgeApiV1(this.plugin);
    }

}
