import { request, Notice } from 'obsidian';
import * as http from 'http';
import { ZoteroBridgeSettings } from './ZoteroBridgeSettings';
import { ZoteroItem } from './ZoteroItem';
import { ZoteroBridgeConnectionType } from './ZoteroBridgeSettings'

type ZoteroItemsRequestParameters = {
    itemType?: string,
    tag?: string,
    format?: string,
    include?: string,
    since?: string,
    sort?: string,
    q?: string
}

function localApiRequest(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = http.get(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'ZoteroBridge',
                'Zotero-Allowed-Request': 'true',
            },
        }, response => {
            let body = '';

            response.setEncoding('utf8');
            response.on('data', chunk => body += chunk);
            response.on('end', () => {
                if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
                    reject(new Error(`Zotero Local API returned HTTP ${response.statusCode}: ${body}`));
                    return;
                }

                resolve(body);
            });
        });

        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy(new Error('Zotero Local API request timed out'));
        });
    });
}

function localApiRequestWithFallback(url: string): Promise<string> {
    return request({
        url,
        method: 'get',
        contentType: 'application/json',
        headers: { 'Zotero-Allowed-Request': 'true' }
    }).catch(() => localApiRequest(url));
}

/**
 * Connection to Zotero API
 * Either ZotServer or LocalAPI
 */
export interface ZoteroAdapter {
    settings: ZoteroBridgeSettings;
    get baseUrl(): string;
    search(query: string): Promise<ZoteroItem[]>;
    items(parameters: ZoteroItemsRequestParameters): Promise<ZoteroItem[]>;
}

/**
 * LocalAPI v3 connection adapter
 * Available in Zotero since v7 (beta-88)
 */
export class LocalAPIV3Adapter implements ZoteroAdapter {
    settings: ZoteroBridgeSettings;

    constructor(settings: ZoteroBridgeSettings) {
        this.settings = settings;
    }

    get baseUrl(): string {
        return `http://${this.settings.host}:${this.settings.port}/api/${this.settings.userOrGroup}`;
    }

    search(query: string) {
        return this.items({
            itemType: '-attachment',
            q: query
        })
    }

    groups(): Promise<any[]> {
        return localApiRequestWithFallback(`http://${this.settings.host}:${this.settings.port}/api/users/0/groups`)
            .then(JSON.parse)
            .then((groups: any[]) => groups.map(group => group.data));
    }

    items(parameters: ZoteroItemsRequestParameters): Promise<ZoteroItem[]> {
        return localApiRequestWithFallback(`${this.baseUrl}/items?` + new URLSearchParams(parameters).toString())
            .then(JSON.parse)
            .then((items: any[]) => items.filter(item => !['attachment', 'note'].includes(item.data.itemType)).map(item => new ZoteroItem(item)))
            .catch(() => {
                new Notice(`Couldn't connect to Zotero, please check the app is open and Zotero Local API is enabled`);
                return [];
            });
    }
}
/**
 * ZotServer connection adapter
 */
export class ZotServerAdapter implements ZoteroAdapter {
    settings: ZoteroBridgeSettings;

    constructor(settings: ZoteroBridgeSettings) {
        this.settings = settings;
    }

    get baseUrl(): string {
        return `http://${this.settings.host}:${this.settings.port}/zotserver`;
    }

    search(query: string) {
        return this.items({
            q: query
        })
    }

    items(parameters: ZoteroItemsRequestParameters): Promise<ZoteroItem[]> {
        return request({
            url: `${this.baseUrl}/search`,
            method: 'post',
            contentType: 'application/json',
            body: JSON.stringify([{
                condition: 'quicksearch-titleCreatorYear',
                value: parameters.q
            }])
        })
            .then(JSON.parse)
            .then((items: any[]) => items.filter(item => !['attachment', 'note'].includes(item.itemType)).map(item => new ZoteroItem({ data: item })))
            .catch(() => {
                new Notice(`Couldn't connect to Zotero, please check the app is open and ZotServer is installed`);
                return [];
            });
    }
}

export const ZoteroAdapters = {
    [ZoteroBridgeConnectionType.ZotServer]: ZotServerAdapter,
    [ZoteroBridgeConnectionType.LocalAPIV3]: LocalAPIV3Adapter,
}
