import { sanitizeHTMLToDom } from 'obsidian';

export interface ZoteroRawItem {
    meta: {
        creatorSummary?: string;
        parsedDate?: string;
    };
    data: {
        key: string;
        title?: string;
        shortTitle?: string;
        creators?: any[];
        date?: string;
        note?: string;
    }
}

/** @public */
export class ZoteroItem {

    raw: ZoteroRawItem;

    constructor(raw: ZoteroRawItem) {
        this.raw = raw;
    }

    getKey() {
        return this.raw.data.key;
    }

    getTitle() {
        return this.raw.data.title || this.raw.data.shortTitle || this.getNoteExcerpt() || '[No Title]';
    }

    getShortTitle() {
        return this.raw.data.shortTitle;
    }

    getCreatorSummary() {
        return this.raw.meta.creatorSummary;
    }

    getAuthors() {
        return this.getCreators()
            .filter(creator => creator.creatorType === 'author')
            .map(this.normalizeName);
    }

    getAuthor() {
        return this.getAuthors()[0];
    }

    getCreators() {
        return this.raw.data.creators || [];
    }

    getDate() {
        const date = this.raw.meta.parsedDate || this.raw.data.date;
        return date ? this.formatDate(date) : { year: null, month: null, day: null };
    }

    getNoteExcerpt() {
        if (this.raw.data.note) {
            const div = document.createElement('div');
            div.appendChild(sanitizeHTMLToDom(this.raw.data.note));
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

        if (isNaN(dateObject.getTime())) {
            return null;
        }

        return {
            year: dateObject.getUTCFullYear(),
            month: dateObject.getUTCMonth() + 1,
            day: dateObject.getUTCDate()
        }
    }

    getValues() {
        return {
            key: this.getKey(),
            title: this.getTitle(),
            shortTitle: this.getShortTitle(),
            date: this.getDate(),
            authors: this.getAuthors(),
            firstAuthor: this.getAuthor(),
            creatorSummary: this.getCreatorSummary(),
        };
    }
}
