import { ZoteroPlugin } from './ZoteroPlugin';
import { App, PluginSettingTab, Setting } from 'obsidian';

export class ZoteroSettingTab extends PluginSettingTab {
    plugin: ZoteroPlugin;

    constructor(app: App, plugin: ZoteroPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        this.containerEl.empty();

        const description = document.createDocumentFragment();

        description.append(
            description.createEl('a', {
                href: 'https://mozilla.github.io/nunjucks/templating.html#builtin-filters',
                text: 'Nunjucks',
            }),
            ' syntax is supported.',
        );

        new Setting(this.containerEl)
            .setName('Link title template')
            .setDesc(description)
            .addText((text) => text.setPlaceholder('default: {{ title }}')
                .setValue(this.plugin.settings.linkTemplate)
                .onChange(async (value) => {
                    await this.plugin.saveSettings({
                        linkTemplate: value
                    });
                }));



        const availableKeywords = document.createDocumentFragment();
        const keywordList = availableKeywords.createEl('ul');
        keywordList.appendChild(availableKeywords.createEl('li', { text: '{{ key }} - Zotero item key' }));
        keywordList.appendChild(availableKeywords.createEl('li', { text: '{{ title }} - item title' }));
        keywordList.appendChild(availableKeywords.createEl('li', { text: '{{ date.year }} - publication year e.g. 2011'}));
        keywordList.appendChild(availableKeywords.createEl('li', { text: '{{ date.month }} - publication month  e.g. 10' }));
        keywordList.appendChild(availableKeywords.createEl('li', { text: '{{ date.day }} - publication day e.g. 31' }));
        keywordList.appendChild(availableKeywords.createEl('li', { text: '{{ firstAuthor.fullName }} - first author\'s full name' }));
        keywordList.appendChild(availableKeywords.createEl('li', { text: '{{ firstAuthor.firstName }} - first author\'s first name' }));
        keywordList.appendChild(availableKeywords.createEl('li', { text: '{{ firstAuthor.lastName }} - first author\'s last name' }));
        keywordList.appendChild(availableKeywords.createEl('li', { text: '{% for author in authors %}{{ author.lastName}}, {{ author.firstName | first }}., {% endfor %}'}));

        availableKeywords.append(
            'Following keywords are available:',
            keywordList
        );

        new Setting(this.containerEl).setDesc(availableKeywords);
    }
}
