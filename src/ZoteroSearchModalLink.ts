
import { ZoteroSearchModal } from './ZoteroSearchModal';
import { ZoteroItem } from './ZoteroItem';

export class ZoteroSearchModalLink extends ZoteroSearchModal {

    onChooseSuggestion(item: ZoteroItem) {
        this.editor.replaceRange(item.getLink(), this.editor.getCursor());
    }
}
