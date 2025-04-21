export interface ZoteroRawItem {
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
            return this.raw.meta.creatorSummary;
        } else {
            return this.getAuthor() ? this.getAuthor().fullName : '';
        }
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
        let date = this.raw.data.date;
        const noDate: structuredDate = { year: null, month: null, day: null };

        if (
            this.raw.hasOwnProperty("meta") &&
            this.raw.meta.hasOwnProperty("parsedDate")
        ) {
            date = this.raw.meta.parsedDate;
        }

        return date
            ? this.formatDate(date, noDate)
            : noDate;
    }

    normalizeName(creator: any) {
        const names = {
            firstName: creator.firstName,
            lastName: creator.lastName,
            fullName: '',
        };

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

    formatDate(date: string, noDate: structuredDate): structuredDate {
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
            title: this.getTitle(),
            shortTitle: this.getShortTitle(),
            date: this.getDate(),
            authors: this.getAuthors(),
            firstAuthor: this.getAuthor(),
            creatorSummary: this.getCreatorSummary(),
        };
    }
}
