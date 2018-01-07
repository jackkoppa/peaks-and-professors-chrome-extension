import { TabsHelper } from '../tabs/tabs-helper';

import { Message, MessageType, Origin } from './message-type.models';

export class MessagingService {
    private tabId: number = 0;

    constructor(
        private origin: Origin
    ) {
        if (this.origin === 'popup') TabsHelper.useDefaultId(tabId => this.tabId = tabId);
    }

    public send(messageType: MessageType, messageValue?: any, responseCallback?: (response: any) => void): void {
        this.origin === 'popup' ? 
            chrome.tabs.sendMessage(this.tabId, this.message(messageType, messageValue), responseCallback) :
            chrome.runtime.sendMessage(this.message(messageType, messageValue), responseCallback);
    }

    public subscribe(messageType: MessageType, action: () => void, responseCallback?: (response: any) => void): void {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if ((message as Message).type === messageType)
                action();
        });
    }

    private message(messageType: MessageType, messageValue?: any): Message {
        return {
            type: messageType,
            value: messageValue ? messageValue : undefined
        }
    }
}