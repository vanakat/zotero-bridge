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
            ' syntax is supported. ',
        );

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
            'The following keywords are available:',
            keywordList
        );

        description.append(availableKeywords);

        new Setting(this.containerEl).setDesc(description);


        // links
        this.containerEl.createEl('h4', { text: 'Link settings' });

        new Setting(this.containerEl)
            .setName('Link title template')
            .addText((text) => text.setPlaceholder('default: {{ title }}')
                .setValue(this.plugin.settings.linkTemplate)
                .onChange(async (value) => {
                    await this.plugin.saveSettings({
                        linkTemplate: value
                    });
                }));

        // note
        this.containerEl.createEl('h4', { text: 'Note settings' });

        new Setting(this.containerEl)
            .setName('Note directory')
            .addText((text) => text
                    .setValue(this.plugin.settings.noteDirectory)
                    .onChange(async (value) => {
                    await this.plugin.saveSettings({
                        noteDirectory: value
                    });
                }))
            .setDesc(
                'Save note file in this directory within the vault. If empty, notes will be stored in the root directory of the vault.',
            );

        new Setting(this.containerEl)
            .setName('Note title template')
            .addText((text) => text
                    .setValue(this.plugin.settings.noteTitleTemplate)
                    .onChange(async (value) => {
                    await this.plugin.saveSettings({
                        noteTitleTemplate: value
                    });
                }));

        new Setting(this.containerEl)
            .setName('Note content template')
            .addTextArea((text) => text
                    .setValue(this.plugin.settings.noteContentTemplate)
                    .onChange(async (value) => {
                    await this.plugin.saveSettings({
                        noteContentTemplate: value
                    });
                }));
    }
}
