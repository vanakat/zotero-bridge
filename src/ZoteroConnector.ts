import { request, Notice } from 'obsidian';
import { ZoteroBridgeSettings } from './ZoteroBridgeSettings';
import { ZoteroItem } from './ZoteroItem';

export class ZoteroConnector {

    settings: ZoteroBridgeSettings;

    constructor(settings: ZoteroBridgeSettings) {
        this.settings = settings;
    }

    get baseUrl(): string {
        return `http://${this.settings.host}:${this.settings.port}/zotserver`;
    }

    public searchEverything(query: string) {
        return this.search([{
            condition: 'quicksearch-everything',
            value: query
        }])
    }

    public search(conditions: any[]) {
        return request({
            url: `${this.baseUrl}/search`,
            method: 'post',
            contentType: 'application/json',
            body: JSON.stringify(conditions)
        })
            .then(JSON.parse)
            .then((items: []) => items.map(item => new ZoteroItem(item)))
            .catch(() => {
                new Notice(`Couldn't connect to Zotero, please check the app is open and ZotServer is installed`);
                return [];
            });
    }
}
