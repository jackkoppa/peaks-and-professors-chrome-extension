import { environment } from '../environment';

export class TabsHelper {
    static useDefaultId(callback: (tabId: number) => void): void {
        chrome.tabs && chrome.tabs.query({url: environment.urlMatch}, tabs => {
            callback(tabs && tabs[0].id);
        });
    }
}