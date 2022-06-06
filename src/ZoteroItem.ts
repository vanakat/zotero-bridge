import { sanitizeHTMLToDom } from 'obsidian';

export interface ZoteroRawItem {
    key: string;
    title?: string;
    shortTitle?: string;
    creators?: any[];
    date?: string;
    note?: string;
}

export class ZoteroItem {

    raw: ZoteroRawItem;

    constructor(raw: ZoteroRawItem) {
        this.raw = raw;
    }

    getKey() {
        return this.raw.key;
    }

    getTitle() {
        return this.raw.shortTitle || this.raw.title || this.getNoteExcerpt() || '[No Title]';
    }

    // @todo: some transformations in this class should be moved to ZotServer
    // breaking changes for ZotServer v2
    getAuthors() {
        return this.getCreators()
            .filter(creator => creator.creatorType === 'author')
            .map(this.normalizeName);
    }

    getAuthor() {
        return this.getAuthors()[0];
    }

    getCreators() {
        return this.raw.creators || [];
    }

    getDate() {
        return this.raw.date ? this.formatDate(this.raw.date) : '';
    }

    getNoteExcerpt() {
        if (this.raw.note) {
            const div = document.createElement('div');
            div.appendChild(sanitizeHTMLToDom(this.raw.note));
            return (div.textContent || div.innerText || '').trim().substring(0, 50) + '...';
        }

        return '';
    }

    normalizeName(creator: any) {
        const names = {
            firstName: creator.firstName,
            lastName: creator.lastName,
            fullName: ''
        }

        if (creator.hasOwnProperty('name')) {
            const delimiter = creator.name.lastIndexOf(' ');
            names.firstName = creator.name.substring(0, delimiter + 1).trim();
            names.lastName = creator.name.substring(delimiter).trim();
            names.fullName = creator.name;

        } else {
            names.fullName = `${names.firstName} ${names.lastName}`;
        }


        return names;
    }

    formatDate(date: string) {
        const dateObject = new Date(date);

        return {
            year: dateObject.getFullYear(),
            month: dateObject.getMonth(),
            day: dateObject.getDate()
        }
    }

    getValues() {
        return {
            key: this.getKey(),
            title: this.getTitle(),
            date: this.getDate(),
            authors: this.getAuthors(),
            firstAuthor: this.getAuthor(),
        };
    }
}
