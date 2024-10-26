# Obsidian Zotero Bridge Plugin

Obsidian-Zotero integration plugin that provides APIs for other plugins to connect to Zotero.

## Prerequisites

### Zotero >= 7

Enable Local API feature in settings: `Settings > Advanced > Allow other applications on this computer to communicate with Zotero`

### Zotero <= 6

Install Zotero addon [ZotServer](https://github.com/MunGell/ZotServer)

## How to use

Zotero Bridge provides APIs for other plugins to connect to Zotero.

Example of such consumer plugin is [Zotero Link](https://github.com/vanakat/zotero-link).

APIs of this plugin are published with Obsidian [plugin api](https://github.com/vanakat/plugin-api) library and can be used anywhere in Obsidian.

Example use of Zotero Bridge APIs in [Templater](https://github.com/SilentVoid13/Templater) [user scripts](https://silentvoid13.github.io/Templater/user-functions/script-user-functions.html):

`zotero.js` user script:

```js
module.exports = async function () {
    const item = await PluginApi.ZoteroBridge.v1().search();
    return (prop) => dotAccess(prop, item.getValues());
}

function dotAccess(str, obj) {
    return str.split('.').reduce((previousValue, currentValue) => previousValue[currentValue], obj);
}
```

This function can now be used in templates:

_(this example is taken from https://github.com/vanakat/zotero-bridge/pull/2)_

```
<%* const zi = await tp.user.zotero() %>


<% zi('firstAuthor.lastName') %><%* if (zi('authors.length')  == 2) { %> and <% zi('authors')[1].lastName %><%* } else if (zi('authors.length') > 2) { %> et al.<%* } %> <% zi('date.year') %> <% zi('title') %>
```

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
* [Zotero 7 Local API announcement](https://groups.google.com/g/zotero-dev/c/ElvHhIFAXrY/m/fA7SKKwsAgAJ)

## Other Zotero integration plugins

While working on this plugin I found another Zotero integration one called [Zotero Integration](https://github.com/mgmeyers/obsidian-zotero-integration).
If you are looking for a citation/bibliography integration with Zotero it might be a good option for you.

## License

MIT
