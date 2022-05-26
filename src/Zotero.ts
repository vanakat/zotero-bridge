
import { request } from 'obsidian';

export default class Zotero {

    baseUrl: string;

    constructor(host = 'localhost', port = '23119') {
        this.baseUrl = `http://${host}:${port}/zotserver`;
    }

    public searchEverything(query: string) {
        return this.search([{
            "condition": "quicksearch-everything",
            "value": query
        }])
    }

    public search(conditions: any[]) {
        return request({
            url: `${this.baseUrl}/search`,
            method: 'post',
            contentType: 'application/json',
            body: JSON.stringify(conditions)
        });
    }
}
