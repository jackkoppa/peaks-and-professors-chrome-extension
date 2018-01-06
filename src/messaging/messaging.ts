import { MessageType, PortName, Origin } from './message-type.models';

export class Messaging {
    private port: chrome.runtime.Port;
    private connectionInfo: chrome.runtime.ConnectInfo;

    constructor(
        private initiating: boolean,
        private location: Origin,
        private portName: PortName = PortName.Trips
    ) {
        this.connectionInfo = { name: this.connectionInfo as string }; 
        if (this.location === 'content')
            this.port = chrome.runtime.connect(this.connectionInfo);
        else if (this.location === 'popup')
            this.port = chrome.tabs.connect(0, this.connectionInfo);
    }

    public send(messageType: MessageType, responseCallback?: (response: any) => void): void {
        responseCallback ? 
            chrome.runtime.sendMessage(messageType, responseCallback) :
            chrome.runtime.sendMessage(messageType);
    }

    public subscribe(messageType: MessageType, action: () => void, responseCallback?: (response: any) => void): void {
        console.log('subscribed called');
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log('got message that looks like:', message);
            if (message[messageType])
                action();
        });
    }
}