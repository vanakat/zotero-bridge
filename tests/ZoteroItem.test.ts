import { ZoteroItem, ZoteroRawItem } from "../src/ZoteroItem";
import * as zotero6Mock from "./mocks/zotero6.json";
import * as zotero7Mock from "./mocks/zotero7.json";

// Helper function to create minimal ZoteroRawItem mocks
const createMockItem = (data: Partial<ZoteroRawItem["data"]>, meta?: Partial<ZoteroRawItem["meta"]>): ZoteroRawItem => {
    return {
        data: {
            key: "TEST_KEY", // Default key unless overridden
            ...data,
        },
        ...(meta && { meta }), // Conditionally add meta if provided
    };
};

describe("ZoteroItem", () => {
    // --- Basic items from mocks for broader testing ---
    const zotero6SampleItem = new ZoteroItem({ data: zotero6Mock[0] });
    const zotero6NoShortTitleItem = new ZoteroItem({ data: zotero6Mock[1] });
    const zotero6NoAuthorItem = new ZoteroItem({ data: zotero6Mock[5] });
    const zotero6NoDateItem = new ZoteroItem({ data: zotero6Mock[3] });

    const zotero7SampleItem = new ZoteroItem(zotero7Mock[0] as ZoteroRawItem);
    const zotero7ShortTitleItem = new ZoteroItem(zotero7Mock[4] as ZoteroRawItem);
    const zotero7MultiAuthorItem = new ZoteroItem(zotero7Mock[5] as ZoteroRawItem);
    const zotero7NoAuthorItem = new ZoteroItem(zotero7Mock[6] as ZoteroRawItem);
    const zotero7BlogPostItem = new ZoteroItem(zotero7Mock[1] as ZoteroRawItem); // Has 'name' field for creator

    describe("getKey()", () => {
        it("should correctly extract item key for Zotero 6", () => {
            expect(zotero6SampleItem.getKey()).toBe("7EH9HZXV");
        });

        it("should correctly extract item key for Zotero 7", () => {
            expect(zotero7SampleItem.getKey()).toBe("8NNLV8L2");
        });

        it("should return the key even if other data is missing", () => {
            const item = new ZoteroItem(createMockItem({ key: "MINIMALKEY" }));
            expect(item.getKey()).toBe("MINIMALKEY");
        });
    });

    describe("getTitle()", () => {
        it("should return the main title when present (Z6)", () => {
            expect(zotero6SampleItem.getTitle()).toBe("Cultivating Everyday Courage: Short text is here");
        });

        it("should return the main title when present (Z7)", () => {
            expect(zotero7SampleItem.getTitle()).toBe("A typology of organisational cultures");
        });

        it("should return the main title even if shortTitle is also present", () => {
            const item = new ZoteroItem(createMockItem({ title: "Main Title", shortTitle: "Short Title" }));
            expect(item.getTitle()).toBe("Main Title");
        });

        it("should return the shortTitle if main title is missing or empty", () => {
            const item1 = new ZoteroItem(createMockItem({ shortTitle: "Only Short Title" }));
            const item2 = new ZoteroItem(createMockItem({ title: "", shortTitle: "Short Title Wins" }));
            expect(item1.getTitle()).toBe("Only Short Title");
            expect(item2.getTitle()).toBe("Short Title Wins");
        });

        it("should return '[No Title]' if both title and shortTitle are missing", () => {
            const item = new ZoteroItem(createMockItem({}));
            expect(item.getTitle()).toBe("[No Title]");
        });

        it("should return '[No Title]' if both title and shortTitle are empty strings", () => {
            const item = new ZoteroItem(createMockItem({ title: "", shortTitle: "" }));
            expect(item.getTitle()).toBe("[No Title]");
        });
    });

    describe("getShortTitle()", () => {
        it("should return the shortTitle when present (Z6)", () => {
            expect(zotero6SampleItem.getShortTitle()).toBe("Hello people");
        });

        it("should return the shortTitle when present (Z7)", () => {
            expect(zotero7ShortTitleItem.getShortTitle()).toBe("Deep Learning in Neural Networks");
        });

        it("should return undefined if shortTitle is missing (Z6)", () => {
            expect(zotero6NoShortTitleItem.getShortTitle()).toBeUndefined();
        });

        it("should return undefined if shortTitle is missing (Z7)", () => {
            expect(zotero7SampleItem.getShortTitle()).toBeUndefined();
        });

        it("should return an empty string if shortTitle is an empty string", () => {
            const item = new ZoteroItem(createMockItem({ shortTitle: "" }));
            expect(item.getShortTitle()).toBe("");
        });
    });

    describe("getCreatorSummary()", () => {
        it("should return meta.creatorSummary when present (Z7)", () => {
            expect(zotero7SampleItem.getCreatorSummary()).toBe("Westrum");
            expect(zotero7MultiAuthorItem.getCreatorSummary()).toBe("Rozanski and Woods");
        });

        it("should return meta.creatorSummary even if it's an empty string (Z7)", () => {
            const item = new ZoteroItem(createMockItem({}, { creatorSummary: "" }));
            expect(item.getCreatorSummary()).toBe("");
        });

        it("should fallback to first author's full name if meta.creatorSummary is missing (Z7)", () => {
            // Mock item simulating Z7 structure but missing the specific meta field
            const mockZ7MissingMetaSummary = createMockItem(
                { creators: [{ firstName: "John", lastName: "Doe", creatorType: "author" }] },
                { parsedDate: "2023-01-01" } // Meta exists, but not creatorSummary
            );
            const item = new ZoteroItem(mockZ7MissingMetaSummary);
            expect(item.getCreatorSummary()).toBe("John Doe");
        });

        it("should fallback to first author's full name (Z6 - no meta)", () => {
            expect(zotero6SampleItem.getCreatorSummary()).toBe("James R. Detert");
            expect(zotero6NoShortTitleItem.getCreatorSummary()).toBe("Marcus Buckingham");
        });

        it("should fallback to empty string if meta.creatorSummary is missing and no authors exist (Z7)", () => {
            const mockZ7NoAuthors = createMockItem(
                { creators: [{ firstName: "Jane", lastName: "Smith", creatorType: "editor" }] },
                { parsedDate: "2023-01-01" }
            );
            const item1 = new ZoteroItem(mockZ7NoAuthors);
            const item2 = new ZoteroItem(createMockItem({}, { parsedDate: "2023-01-01" })); // No creators field at all

            expect(item1.getCreatorSummary()).toBe("");
            expect(item2.getCreatorSummary()).toBe("");
            expect(zotero7NoAuthorItem.getCreatorSummary()).toBe(""); // From actual Z7 mock data
        });

        it("should fallback to empty string if no authors exist (Z6 - no meta)", () => {
            expect(zotero6NoAuthorItem.getCreatorSummary()).toBe("");
            const item = new ZoteroItem(createMockItem({ creators: [] })); // Empty creators array
            expect(item.getCreatorSummary()).toBe("");
            const item2 = new ZoteroItem(createMockItem({})); // No creators field
            expect(item2.getCreatorSummary()).toBe("");
        });
    });

    describe("getCreators()", () => {
        it("should return the creators array when present", () => {
            expect(zotero6SampleItem.getCreators()).toEqual([{ name: "James R. Detert", creatorType: "author" }]);
            expect(zotero7MultiAuthorItem.getCreators()).toEqual([
                { firstName: "Nick", lastName: "Rozanski", creatorType: "author" },
                { firstName: "Eoin", lastName: "Woods", creatorType: "author" },
            ]);
        });

        it("should return an empty array if creators array is empty", () => {
            expect(zotero6NoAuthorItem.getCreators()).toEqual([]);
            const item = new ZoteroItem(createMockItem({ creators: [] }));
            expect(item.getCreators()).toEqual([]);
        });

        it("should return an empty array if creators field is missing", () => {
            const item = new ZoteroItem(createMockItem({}));
            expect(item.getCreators()).toEqual([]);
        });
    });

    describe("normalizeName()", () => {
        // Testing normalizeName implicitly via getAuthors

        it("should handle 'name' field (Z6 style)", () => {
            const item = new ZoteroItem(createMockItem({ creators: [{ name: "James R. Detert", creatorType: "author" }] }));
            expect(item.getAuthors()).toEqual([{ firstName: "James R.", lastName: "Detert", fullName: "James R. Detert" }]);
        });

        it("should handle 'firstName' and 'lastName' fields (Z7 style)", () => {
            const item = new ZoteroItem(createMockItem({ creators: [{ firstName: "Marcus", lastName: "Buckingham", creatorType: "author" }] }));
            expect(item.getAuthors()).toEqual([{ firstName: "Marcus", lastName: "Buckingham", fullName: "Marcus Buckingham" }]);
        });

        it("should handle 'name' field when it looks like Z7 style (used in some Z7 blog posts)", () => {
            expect(zotero7BlogPostItem.getAuthors()).toEqual([{ firstName: "Kent", lastName: "Beck", fullName: "Kent Beck" }]);
        });


        it("should handle 'name' field with only one part (treat as lastName)", () => {
            const item = new ZoteroItem(createMockItem({ creators: [{ name: "Westrum", creatorType: "author" }] }));
            // Based on current logic: splits on *last* space. No space -> delimiter -1.
            // firstName = substring(0, 0) -> ""
            // lastName = substring(-1) -> "Westrum"
            // fullName = "Westrum"
            expect(item.getAuthors()).toEqual([{ firstName: "", lastName: "Westrum", fullName: "Westrum" }]);
            // This matches Z7 sample item [0] author which has firstName:"R", lastName:"Westrum" -> fullName: "R Westrum"
            // The logic might need adjustment if "" first name is undesirable, but this tests the *current* logic.
            expect(zotero7SampleItem.getAuthors()).toEqual([{ firstName: "R", lastName: "Westrum", fullName: "R Westrum" }]);
        });

        it("should handle missing firstName or lastName", () => {
            const item1 = new ZoteroItem(createMockItem({ creators: [{ lastName: "Doe", creatorType: "author" }] }));
            const item2 = new ZoteroItem(createMockItem({ creators: [{ firstName: "Jane", creatorType: "author" }] }));
            // Note: The current logic defaults missing names to undefined, resulting in "undefined Doe" or "Jane undefined"
            // This might be undesirable, but we test the current behaviour.
            expect(item1.getAuthors()).toEqual([{ firstName: undefined, lastName: "Doe", fullName: "undefined Doe" }]);
            expect(item2.getAuthors()).toEqual([{ firstName: "Jane", lastName: undefined, fullName: "Jane undefined" }]);
        });

        it("should handle empty firstName or lastName strings", () => {
            const item = new ZoteroItem(createMockItem({ creators: [{ firstName: "", lastName: "Doe", creatorType: "author" }] }));
            expect(item.getAuthors()).toEqual([{ firstName: "", lastName: "Doe", fullName: " Doe" }]); // Note the leading space in fullName
        });

        it("should handle empty 'name' field", () => {
            const item = new ZoteroItem(createMockItem({ creators: [{ name: "", creatorType: "author" }] }));
            // No space -> delimiter -1. firstName="", lastName="", fullName=""
            expect(item.getAuthors()).toEqual([{ firstName: "", lastName: "", fullName: "" }]);
        });
    });

    describe("getAuthors()", () => {
        it("should return only creators with creatorType 'author'", () => {
            const item = new ZoteroItem(createMockItem({
                creators: [
                    { firstName: "John", lastName: "Doe", creatorType: "author" },
                    { firstName: "Jane", lastName: "Smith", creatorType: "editor" },
                    { name: "Peter Jones", creatorType: "author" },
                ]
            }));
            expect(item.getAuthors()).toEqual([
                { firstName: "John", lastName: "Doe", fullName: "John Doe" },
                { firstName: "Peter", lastName: "Jones", fullName: "Peter Jones" },
            ]);
        });

        it("should return multiple authors correctly (Z7)", () => {
            expect(zotero7MultiAuthorItem.getAuthors()).toEqual([
                { firstName: "Nick", lastName: "Rozanski", fullName: "Nick Rozanski" },
                { firstName: "Eoin", lastName: "Woods", fullName: "Eoin Woods" },
            ]);
        });

        it("should return an empty array if no creators are authors", () => {
            const item = new ZoteroItem(createMockItem({
                creators: [
                    { firstName: "Jane", lastName: "Smith", creatorType: "editor" },
                    { name: "Test Corp.", creatorType: "contributor" }
                ]
            }));
            expect(item.getAuthors()).toEqual([]);
        });

        it("should return an empty array if creators array is empty or missing", () => {
            const item1 = new ZoteroItem(createMockItem({ creators: [] }));
            const item2 = new ZoteroItem(createMockItem({}));
            expect(item1.getAuthors()).toEqual([]);
            expect(item2.getAuthors()).toEqual([]);
            expect(zotero6NoAuthorItem.getAuthors()).toEqual([]);
            expect(zotero7NoAuthorItem.getAuthors()).toEqual([]);
        });
    });

    describe("getAuthor()", () => {
        it("should return the first author if one exists", () => {
            expect(zotero6SampleItem.getAuthor()).toEqual({ firstName: "James R.", lastName: "Detert", fullName: "James R. Detert" });
            expect(zotero7SampleItem.getAuthor()).toEqual({ firstName: "R", lastName: "Westrum", fullName: "R Westrum" });
        });

        it("should return the first author if multiple exist", () => {
            expect(zotero7MultiAuthorItem.getAuthor()).toEqual({ firstName: "Nick", lastName: "Rozanski", fullName: "Nick Rozanski" });
        });

        it("should return undefined if no authors exist", () => {
            const item1 = new ZoteroItem(createMockItem({ creators: [] }));
            const item2 = new ZoteroItem(createMockItem({}));
            const item3 = new ZoteroItem(createMockItem({ creators: [{ firstName: "Jane", lastName: "Smith", creatorType: "editor" }] }));
            expect(item1.getAuthor()).toBeUndefined();
            expect(item2.getAuthor()).toBeUndefined();
            expect(item3.getAuthor()).toBeUndefined();
            expect(zotero6NoAuthorItem.getAuthor()).toBeUndefined();
            expect(zotero7NoAuthorItem.getAuthor()).toBeUndefined();
        });
    });

    describe("formatDate()", () => {
        // Testing formatDate implicitly via getDate

        it("should handle valid ISO 8601 date string", () => {
            const item = new ZoteroItem(createMockItem({ date: "2023-10-27" }));
            expect(item.getDate()).toEqual({ year: 2023, month: 10, day: 27 });
        });

        it("should handle valid ISO 8601 date-time string (extracts UTC date)", () => {
            // Example from Z6 mock: "2017-01-01T05:00:00Z" -> Jan 1st 2017 UTC
            const item = new ZoteroItem(createMockItem({ date: "2017-01-01T05:00:00Z" }));
            expect(item.getDate()).toEqual({ year: 2017, month: 1, day: 1 });
            // Example from Z7 mock: "2016-07-19T17:30:37.306Z" -> July 19th 2016 UTC
            const item2 = new ZoteroItem(createMockItem({ date: "2016-07-19T17:30:37.306Z" }));
            expect(item2.getDate()).toEqual({ year: 2016, month: 7, day: 19 });
        });

        it("should handle textual month date string (Z6 style)", () => {
            // "1 Nov 2018"
            expect(zotero6SampleItem.getDate()).toEqual({ year: 2018, month: 11, day: 1 });
            // "1 March 2005"
            expect(zotero6NoShortTitleItem.getDate()).toEqual({ year: 2005, month: 3, day: 1 });
        });

        it("should handle month/year date string (Z7 style)", () => {
            // "01/2015"
            expect(zotero7ShortTitleItem.getDate()).toEqual({ year: 2015, month: 1, day: 1 }); // JS Date parses this as Jan 1st
        });

        it("should return default value for completely invalid date strings", () => {
            const item = new ZoteroItem(createMockItem({ date: "invalid date string" }));
            expect(item.getDate()).toEqual({ year: null, month: null, day: null });
        });

        it("should return default value for an empty date string", () => {
            const item = new ZoteroItem(createMockItem({ date: "" }));
            expect(item.getDate()).toEqual({ year: null, month: null, day: null });
        });
    });

    describe("getDate()", () => {
        it("should prefer meta.parsedDate when available and valid (Z7)", () => {
            // Z7 item [0] has meta.parsedDate: "2001-12-01" and data.date: "1 December 2001"
            expect(zotero7SampleItem.getDate()).toEqual({ year: 2001, month: 12, day: 1 });
        });

        it("should fallback to data.date if meta.parsedDate is missing (Z7)", () => {
            // Z7 item [5] has no meta.parsedDate, but has data.date: undefined
            // It should return the default null object in this case.
            // Let's test a case where data.date *is* present.
            const item = new ZoteroItem(createMockItem(
                { date: "2022-08-20" }, // Valid data.date
                { creatorSummary: "Someone" } // Meta exists, but no parsedDate
            ));
            expect(item.getDate()).toEqual({ year: 2022, month: 8, day: 20 });
        });

        it("should use data.date when meta is missing (Z6)", () => {
            expect(zotero6SampleItem.getDate()).toEqual({ year: 2018, month: 11, day: 1 });
        });

        it("should return {year: null, ...} if Z6 data.date is missing", () => {
            expect(zotero6NoDateItem.getDate()).toEqual({ year: null, month: null, day: null });
        });

        it("should return {year: null, ...} if Z7 meta.parsedDate and data.date are missing/undefined", () => {
            // Z7 item [5] fits this
            expect(zotero7MultiAuthorItem.getDate()).toEqual({ year: null, month: null, day: null });
            const item = new ZoteroItem(createMockItem({}, { creatorSummary: "test" })); // Meta exists but no date info
            expect(item.getDate()).toEqual({ year: null, month: null, day: null });
        });


        it("should return {year: null, ...} if Z7 meta.parsedDate and data.date are both invalid", () => {
            const item = new ZoteroItem(createMockItem(
                { date: "invalid data date" },
                { parsedDate: "invalid meta date" }
            ));
            // formatDate will return null for both, so getDate returns the default null object
            expect(item.getDate()).toEqual({ year: null, month: null, day: null });
        });

        it("should return null from formatDate (and thus null from getDate) if date is fundamentally invalid", () => {
            // If formatDate returns null because the string is unparsable
            const invalidDateItem = new ZoteroItem(createMockItem({ date: "totally invalid" }));
            expect(invalidDateItem.getDate()).toEqual({ year: null, month: null, day: null });

            const invalidMetaDateItem = new ZoteroItem(createMockItem({}, { parsedDate: "totally invalid" }));
            expect(invalidMetaDateItem.getDate()).toEqual({ year: null, month: null, day: null });
        });

        it("should return the default null object if date field exists but is null", () => {
            const item = new ZoteroItem(createMockItem({ date: null }));
            expect(item.getDate()).toEqual({ year: null, month: null, day: null });

            const item2 = new ZoteroItem(createMockItem({ date: null }, { parsedDate: null }));
            expect(item2.getDate()).toEqual({ year: null, month: null, day: null });
        });
    });

    describe("getValues()", () => {
        it("should return all values correctly for a typical Zotero 6 item", () => {
            const item = zotero6SampleItem; // Has title, shortTitle, author, date
            expect(item.getValues()).toEqual({
                key: "7EH9HZXV",
                title: "Cultivating Everyday Courage: Short text is here",
                shortTitle: "Hello people",
                date: { year: 2018, month: 11, day: 1 },
                authors: [{ firstName: "James R.", lastName: "Detert", fullName: "James R. Detert" }],
                firstAuthor: { firstName: "James R.", lastName: "Detert", fullName: "James R. Detert" },
                creatorSummary: "James R. Detert",
            });
        });

        it("should return all values correctly for a typical Zotero 7 item", () => {
            const item = zotero7SampleItem; // Has title, no shortTitle, author, date, meta.creatorSummary
            expect(item.getValues()).toEqual({
                key: "8NNLV8L2",
                title: "A typology of organisational cultures",
                shortTitle: undefined, // Explicitly check for undefined
                date: { year: 2001, month: 12, day: 1 },
                authors: [{ firstName: "R", lastName: "Westrum", fullName: "R Westrum" }],
                firstAuthor: { firstName: "R", lastName: "Westrum", fullName: "R Westrum" },
                creatorSummary: "Westrum",
            });
        });

        it("should handle missing optional fields gracefully", () => {
            const item = zotero6NoAuthorItem; // No authors, no date in mock (but date field exists)
            expect(item.getValues()).toEqual({
                key: "T52QYU6J",
                title: "Edsel",
                shortTitle: undefined,
                date: { year: 2020, month: 12, day: 1 }, // It *does* have a parsable date "1 Dec 2020"
                authors: [],
                firstAuthor: undefined,
                creatorSummary: "", // Fallback because no authors
            });
        });

        it("should handle a sparse item with only a key", () => {
            const item = new ZoteroItem(createMockItem({ key: "SPARSE" }));
            expect(item.getValues()).toEqual({
                key: "SPARSE",
                title: "[No Title]",
                shortTitle: undefined,
                date: { year: null, month: null, day: null },
                authors: [],
                firstAuthor: undefined,
                creatorSummary: "",
            });
        });
    });
});
