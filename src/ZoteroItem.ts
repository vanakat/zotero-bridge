export interface ZoteroRawItem {
    library?: {
        type?: string;
        id?: number;
    };
    meta?: {
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
    };
}

type structuredDate = {
    year: number,
    month: number,
    day: number,
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

    /**
     * Library path for zotero:// URIs: `groups/<id>` for group library items,
     * `library` (the personal library) otherwise. ZotServer responses carry no
     * library information, so they fall back to the personal library.
     */
    getLibraryUri() {
        const library = this.raw.library;
        if (library && library.type === 'group' && library.id != null) {
            return `groups/${library.id}`;
        }
        return 'library';
    }

    getTitle() {
        return this.raw.data.title || this.raw.data.shortTitle || '[No Title]';
    }

    getShortTitle() {
        return this.raw.data.shortTitle;
    }

    getCreatorSummary() {
        if (
            this.raw.hasOwnProperty("meta") &&
            this.raw.meta.hasOwnProperty("creatorSummary")
        ) {
            const summary = this.raw.meta.creatorSummary as any;
            if (summary !== undefined && summary !== null) {
                return summary;
            }
        }
        return this.getAuthor() ? this.getAuthor().fullName : '';
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

    getDate(): structuredDate {
        const noDate: structuredDate = { year: null, month: null, day: null };

        // Prefer meta.parsedDate when present and valid; fallback to data.date
        if (this.raw.hasOwnProperty("meta") && this.raw.meta.hasOwnProperty("parsedDate")) {
            const parsedFromMeta = this.formatDate(this.raw.meta.parsedDate as any, noDate);
            if (parsedFromMeta.year !== null) {
                return parsedFromMeta;
            }
        }

        if (this.raw.data.date) {
            return this.formatDate(this.raw.data.date, noDate);
        }

        return noDate;
    }

    normalizeName(creator: any) {
        const names = {
            firstName: creator.firstName,
            lastName: creator.lastName,
            fullName: '',
        };

        if (creator.hasOwnProperty('name')) {
            const trimmedName = creator.name.trim();
            const delimiter = trimmedName.lastIndexOf(' ');
            if (delimiter === -1) {
                // No space found, treat entire name as lastName
                names.firstName = '';
                names.lastName = trimmedName;
            } else {
                names.firstName = trimmedName.substring(0, delimiter).trim();
                names.lastName = trimmedName.substring(delimiter + 1).trim();
            }
            names.fullName = trimmedName;
        } else {
            // Build full name from available parts only to avoid "undefined"/extra spaces
            const parts = [names.firstName, names.lastName].filter(part => part);
            names.fullName = parts.join(' ');
        }

        return names;
    }

    formatDate(date: string | null, noDate: structuredDate): structuredDate {
        // Handle null/undefined dates
        if (date === null || date === undefined) {
            return noDate;
        }

        const dateObject = new Date(date);

        // check on invalid date
        if (isNaN(dateObject.getTime())) {
            return noDate;
        }

        return {
            year: dateObject.getUTCFullYear(),
            month: dateObject.getUTCMonth() + 1,
            day: dateObject.getUTCDate(),
        };
    }

    getValues() {
        return {
            key: this.getKey(),
            libraryUri: this.getLibraryUri(),
            title: this.getTitle(),
            shortTitle: this.getShortTitle(),
            date: this.getDate(),
            authors: this.getAuthors(),
            firstAuthor: this.getAuthor(),
            creatorSummary: this.getCreatorSummary(),
        };
    }
}
