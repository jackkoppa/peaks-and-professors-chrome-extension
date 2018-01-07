import { TabsHelper } from '../tabs/tabs-helper';

import { Message, MessageType, Origin } from './message-type.models';

export class MessagingService {
    private tabId: number = 0;
    private get isExtensionOrigin(): boolean {
        return this.origin === 'popup' || this.origin === 'background';
    }

    constructor(
        private origin: Origin
    ) {
        if (this.isExtensionOrigin) TabsHelper.useDefaultId(tabId => this.tabId = tabId);
    }

    public send(messageType: MessageType, messageValue?: any, responseCallback?: (response: any) => void): void {
        this.isExtensionOrigin ? 
            chrome.tabs.sendMessage(this.tabId, this.message(messageType, messageValue), responseCallback) :
            chrome.runtime.sendMessage(this.message(messageType, messageValue), responseCallback);
    }

    public subscribe(messageType: MessageType, action: (message: Message) => void, responseCallback?: (response: any) => void): void {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if ((message as Message).type === messageType)
                action(message);
        });
    }

    private message(messageType: MessageType, messageValue?: any): Message {
        return {
            type: messageType,
            value: messageValue ? messageValue : undefined
        }
    }
}