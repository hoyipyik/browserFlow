import { scriptResult } from "../renderer/types/common.odt";
import { windowId } from "./play.util";

export const scriptInjecteHandler = (code: any, args: any): Promise<scriptResult[]> => {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, windowId: windowId }, function (tabs) {
            tabs = tabs.filter((e) => {
                if (e.url === "chrome-extension://gikinjmhoehdoildnpeboogagmofhheo/popup.html"
                    || (e.pendingUrl && e.pendingUrl === "chrome-extension://gikinjmhoehdoildnpeboogagmofhheo/popup.html")) {
                    return false;
                }
                return true;
            });
            chrome.scripting.executeScript({
                target: { tabId: tabs[tabs.length - 1].id! },
                func: code,
                args: [...args],
            }, (msg) => {
                // Resolve the promise with the result;
                console.log(msg[0].result, '++++++++++++++++++++++');
                //wait till page load
                chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                    if (info.status === 'complete' && tabId === tabId) {
                        chrome.tabs.onUpdated.removeListener(listener);
                        
                    }
                })
                resolve(msg[0].result);
            });
        });
    });
}