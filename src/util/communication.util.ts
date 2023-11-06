import { Channel, ChromeMsg } from "../renderer/types/chromeMsg.odt";

/**
 * Sender
 */

// content2bg sendMessage
// content2pop sendMessage
// pop2bg sendMessage
// pop2content tab
// bg2pop tab
// bg2content tab 

export const sendFromContentToPopup = (channel: Channel, data: any) => {
    const sendData: ChromeMsg = {
        data: data,
        channel: channel
    };
    chrome.runtime.sendMessage(sendData, (msg) => {
        console.log('content2popup send success', msg);
    });
}

export const sendFromContentToBackground = (channel: Channel, data: any) => {
    const sendData: ChromeMsg = {
        channel: channel,
        data: data
    }
    console.log('tab send ((((')
    chrome.runtime.sendMessage(sendData, (msg) => {
        console.log('content2bg send success', msg);
    });
}

export const sendFromBackgroundToPopup = async (channel: Channel, data: any) => {
    const sendData: ChromeMsg = {
        channel: channel,
        data: data,
    }
    chrome.tabs.query({ url: "chrome-extension://gikinjmhoehdoildnpeboogagmofhheo/popup.html" }, (tabs) => {
        if (tabs.length > 0) {
            const popupTabId = tabs[0].id!;
            chrome.tabs.sendMessage(
                popupTabId,
                sendData,
                (response) => console.log('bg2popup send success', response)
            );
        }
    });
}

export const sendFromBackgroundToContent = (channel: Channel, data: any) => {
    const sendData: ChromeMsg = {
        channel: channel,
        data: data
    }
    chrome.tabs.query({ active: true }, function (tabs) {
        tabs = tabs.filter((e) => {
            if (e.url === "chrome-extension://gikinjmhoehdoildnpeboogagmofhheo/popup.html" 
            || (e.pendingUrl && e.pendingUrl === "chrome-extension://gikinjmhoehdoildnpeboogagmofhheo/popup.html")) {
                return false;
            }
            return true;
        })
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId!, sendData, (response) => console.log('bg2content send success', response));
    })
}

export const sendFromPopupToContent = (channel: Channel, data: any) => {
    const sendData: ChromeMsg = {
        channel: channel,
        data: data
    };
    // Send the message to the content script
    chrome.tabs.query({}, function (tabs) {
        // console.log(tabs);
        if (tabs) {
            for (const tab of tabs) {
                try {
                    chrome.tabs.sendMessage(tab.id as number, sendData, (msg) => {
                        // console.log("result message:", msg, tab);
                    });
                } catch (err) {
                    console.log(err, "checkmate");
                }
            }
        }
    });
}

export const sendFromPopupToBackground = (channel: Channel, data: any) => {
    const sendData: ChromeMsg = {
        channel: channel,
        data: data
    };
    chrome.runtime.sendMessage(sendData, (msg) => {
        console.log('popup2bg send success', msg);
    });
}

/**
 * Receiver
 */

// chrome.runtime.onMessage.addListener(msg, sender, responce => {})
