# Obsidian Zotero Plugin

Obsidian-Zotero connector plugin that allows to search and insert links to Zotero items from Obsidian interface.

**Requires [ZotServer](https://github.com/MunGell/ZotServer) addon installed in your Zotero**

## How to use

This plugin requires Zotero app being open with [ZotServer](https://github.com/MunGell/ZotServer) addon installed.

After installation new command is available in command palette (`Cmd+P`) – `Zotero: Insert Link`

## How to contribute

1. Fork and clone this repository
2. Link this directory to your plugins directory: `ln -sfn <this-directory> <your-test-vault>/.obsidian/plugins/obsidian-zotero`
3. `npm install` to install all dependencies
4. `npm run dev` will run development server
5. Reload your Obsidian with test vault open

Please refer to following helpful resources:

* [Unofficial Obsidian API docs](https://marcus.se.net/obsidian-plugin-docs/)
* [Official Obsidian API definition file](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts)
* [ZotServer repository](https://github.com/MunGell/ZotServer) for documentation on API
* [Zotero search API code](https://github.com/zotero/zotero/blob/master/chrome/content/zotero/xpcom/data/search.js) for the most up-to-date search API documentation

## Other Zotero integration plugins

While working on this plugin I found another Zotero integration one called [Zotero Integration](https://github.com/mgmeyers/obsidian-zotero-integration).
If you are looking for a citation/bibliography integration with Zotero it might be a good option for you.

## License

MIT
