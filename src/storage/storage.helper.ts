import { LocalStorage } from "./local-storage.model";

export class StorageHelper {
    static setLocal(localStorage: LocalStorage, callback?: () => void): void {
        chrome.storage.local.set(localStorage, callback);
    }

    static getLocal(callback: (localStorage: LocalStorage) => void): void {
        chrome.storage.local.get(callback);
    }
}