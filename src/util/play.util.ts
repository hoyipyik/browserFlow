import { tabIdMap } from "../background";
import { scriptInjecteHandler } from "./codeInjection";
import { sendFromContentToBackground } from "./communication.util";


export const scrollPlayer = async (y: string) => {
    const coordinate = {
        y: y,
        x: 0,
    }
    const code = (coordinate: { y: number, x: number }) => {
        window.scrollTo(coordinate.x, coordinate.y);
        return [true, ''];
    }
    const ans = await scriptInjecteHandler(code, [coordinate]);
    return ans;
}

export const simulateClick = async (cssSelector: string) => {
    // console.log('@click')
    const code = (cssSelector: string) => {
        const event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        });
        const element = document.querySelector(cssSelector);
        // console.log(element, '+++++++++++++++&')
        if (element) {
            try {
                element.dispatchEvent(event);
                console.log("click success", element);
                return [true, ''];
            } catch (e: unknown) {
                if (e instanceof Error) {
                    return [false, e.toString()];
                }
                return [false, 'Unknown error'];
            }
        } else {
            console.log('not found')
            return [false, 'Element not found'];
        }
    }
    const ans = await scriptInjecteHandler(code, [cssSelector]);
    // console.log(ans, 'click')
    return ans;
}

export const simulateInput = async (value: string, cssSelector: string) => {
    const code = (cssSelector: string, value: string) => {
        const element = document.querySelector(cssSelector);
        console.log(element, 'input event play')
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            if (typeof element.value !== 'undefined') {
                // Update the value of the input element
                const holder = element.value;
                // if (value === '\u0008') {
                //     element.value = holder.slice(0, -1)
                // } else {
                element.value = holder + value;
                // }
                const keyboardEvent = new KeyboardEvent('keydown', { code: value, key: value })
                document.dispatchEvent(keyboardEvent);
                return [true, ''];
                // Dispatch the event to the element
                // element.dispatchEvent(inputEvent);
            } else {
                console.log('Element does not have a value property.');
                return [false, 'Element does not have a value property.'];
            }
        } else {
            console.error('simulateInput: The provided element is not an input or textarea element.');
            return [false, 'The provided element is not an input or textarea element.'];
        }
    }
    const ans = await scriptInjecteHandler(code, [cssSelector, value]);
    return ans;
};

export const simulateKeyboardEvent = async (value: string, cssSelector: string) => {
    const code = (cssSelector: string, value: string) => {
        const element = document.querySelector(cssSelector);
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            if (typeof element.value !== 'undefined') {
                // Update the value of the input element
                const holder = element.value;
                if (value === 'Backspace') {
                    element.value = holder.slice(0, -1)
                }
                if (value === 'Enter') {
                    const keydownEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        bubbles: true,
                        cancelable: true
                    });
                    // Dispatch the keydown event to the input element
                    element.dispatchEvent(keydownEvent);
                    return [true, ''];
                }
                const keyboardEvent = new KeyboardEvent('keydown', { code: value, key: value })
                document.dispatchEvent(keyboardEvent);
                return [true, ''];
                // Dispatch the event to the element
                // element.dispatchEvent(inputEvent);
            } else {
                console.log('Element does not have a value property.');
                return [false, 'Element does not have a value property.'];
            }
        } else {
            console.error('simulateInput: The provided element is not an input or textarea element.');
            return [false, 'The provided element is not an input or textarea element.'];
        }
    }
    const ans = await scriptInjecteHandler(code, [cssSelector, value]);
    return ans;
};


export const sendPlayFeedbackToPopup = (status: boolean, msg: string, tagName: string, id: string) => {
    const backData = {
        channel: 'playing-feedback',
        flag: status,
        message: msg,
        name: tagName,
        id: id,
    }
    chrome.runtime.sendMessage(backData, (msg) => {
        console.log(msg, 'send status')
    })
};

export const stopPlayHandler = () => {
    const sendData = {
        channel: 'player-status',
        data: true
    }
    chrome.runtime.sendMessage(sendData, (msg) => {
        console.log(msg, 'send status')
    });
}

export let windowId: number | undefined;

const tabVisitHandler = async (id: string, hash: string,
    url: string, index: number) => {
    return new Promise((resolve, reject) => {
        if (index === 0) {
            chrome.windows.create({ url: String(url), state: 'maximized' },
                (window) => {
                    windowId = window?.id
                    chrome.tabs.query({ active: true, windowId: windowId }, function (tabs: any) {
                        // console.log(tabs, 'tabs ---')
                        tabs = tabs.filter((e: any) => {
                            if (e.url === "chrome-extension://gikinjmhoehdoildnpeboogagmofhheo/popup.html" || (e.pendingUrl && e.pendingUrl === "chrome-extension://gikinjmhoehdoildnpeboogagmofhheo/popup.html")) {
                                // console.log(e, 'extension page')
                                return false;
                            }
                            return true;
                        })
                        const tabId = tabs[0].id;
                        tabIdMap.set(hash, tabId as number);
                        //wait till page load
                        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                            if (info.status === 'complete' && tabId === tabId) {
                                chrome.tabs.onUpdated.removeListener(listener);
                                resolve([true, '']);
                            }
                        })
                    });
                });
        } else {
            if (windowId) {
                chrome.tabs.query({ active: true, windowId: windowId }, async function (tabs: any) {
                    // console.log(tabs, 'tabs ---')
                    tabs = tabs.filter((e: any) => {
                        if (e.url === "chrome-extension://gikinjmhoehdoildnpeboogagmofhheo/popup.html" || (e.pendingUrl && e.pendingUrl === "chrome-extension://gikinjmhoehdoildnpeboogagmofhheo/popup.html")) {
                            console.log(e, 'extension page')
                            return false;
                        }
                        return true;
                    })
                    const tabId = tabs[0].id;
                    tabIdMap.set(hash, tabId as number);
                    await chrome.tabs.update(tabId, { url: String(url) });
                    resolve([true, '']);
                });
            }

        }
    });
}

const tabCreateHanlder = async (id: string, hash: string,
    url: string, index: number) => {
    return new Promise((resolve, reject) => {
        chrome.tabs.create({ url: 'chrome://newtab' }, (tab) => {
            tabIdMap.set(hash, tab.id as number);
        });
        resolve([true, '']);
    });
}

const tabSwitchHandler = async (id: string, hash: string,
    url: string, index: number) => {
    return new Promise((resolve, reject) => {
        const tabId = tabIdMap.get(hash);
        chrome.tabs.update(tabId as number, { active: true });
        resolve([true, '']);
    });
}

export const tabPlayer = async (id: string, hash: string,
    url: string, action: string, index: number) => {
    if (action === 'visit') {
        await tabVisitHandler(id, hash, url, index);
    }
    if (action === 'create') {
        await tabCreateHanlder(id, hash, url, index);
    }
    if (action === 'switch') {
        await tabSwitchHandler(id, hash, url, index);
    }
};

export const clearTabStackHandler = () => {
    const sendData = {
        clearFlag: true
    }
    sendFromContentToBackground('clear-tab-flag', sendData);
}