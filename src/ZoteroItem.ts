export interface RawItem {
    key: string;
    title?: string;
    shortTitle?: string;
    note?: string;
}

export class ZoteroItem {

    raw: RawItem;

    constructor(raw: RawItem) {
        this.raw = raw;
    }

    getKey() {
        return this.raw.key;
    }

    getTitle() {
        return this.raw.shortTitle || this.raw.title || this.getNoteExcerpt() || '[No Title]';
    }

    getNoteExcerpt() {
        if (this.raw.note) {
            const div = document.createElement('div');
            div.innerHTML = this.raw.note;
            return (div.textContent || div.innerText || '').substring(0, 50) + '...';
        }

        return '';
    }
}
