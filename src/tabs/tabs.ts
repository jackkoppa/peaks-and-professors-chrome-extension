import { environment } from '../environment';

export class Tabs {
    static useDefaultId(callback: (tabId: number) => void): void {
        chrome.tabs && chrome.tabs.query({url: environment.urlMatch}, tabs => {
            callback(tabs && tabs[0].id);
        });
    }
}