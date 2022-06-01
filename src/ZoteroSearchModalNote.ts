
import { normalizePath, TFile } from 'obsidian';
import { ZoteroSearchModal } from './ZoteroSearchModal';
import { ZoteroItem } from './ZoteroItem';
import { join } from 'path';

export class ZoteroSearchModalNote extends ZoteroSearchModal {

    async findOrCreateNoteFor(item: ZoteroItem): Promise<TFile> {
        const path = join(this.settings.noteDirectory, `${item.getNoteTitle()}.md`);
        const normalizedPath = normalizePath(path);
        let file = this.app.vault.getAbstractFileByPath(normalizedPath);
        if (!file) {
            const matches = this.app.vault
                .getMarkdownFiles()
                .filter((f) => f.path.toLowerCase() == normalizedPath.toLowerCase());
            if (matches.length > 0) {
                // note exists
                file = matches[0];
            } else {
                // create new note
                try {
                    const directory = normalizePath(this.settings.noteDirectory);
                    const directoryExists = await this.app.vault.adapter.exists(directory);
                    if (!directoryExists) {
                        await this.app.vault.createFolder(directory);
                    }
                    file = await this.app.vault.create(
                        path,
                        item.getNoteContent(),
                    );
                } catch (exc) {
                    console.log('Could not create Zotero note');
                    throw exc;
                }
            }
        }
        return file as TFile;
    }

    onChooseSuggestion(item: ZoteroItem) {
        this.findOrCreateNoteFor(item)
            .then((file: TFile) => {
                this.app.workspace.getLeaf().openFile(file);
            })
            .catch(console.error);
    }
}
