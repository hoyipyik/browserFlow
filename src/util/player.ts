import { isPlaying } from "../background";
import { listItem } from "../renderer/types/common.odt";
import { clearTabStackHandler, scrollPlayer, sendPlayFeedbackToPopup, simulateClick, simulateInput, simulateKeyboardEvent, stopPlayHandler, tabPlayer } from "./play.util";

export const eventPlayer = async (items: listItem[]) => {
    let breakFlag: boolean = false;
    let extralDelay: number = 0;
    let delay;
    for (let index = 0; index < items.length; index++) {
        // print current time
        console.log('start time: ', new Date().getTime())
        const item = items[index];
        if (!isPlaying || breakFlag) {
            console.log('stop at ', index)
            stopPlayHandler();
            return;
        }
        // Calculate the delay based on the timeStamp of the current and previous items.
        if (index > 0)
            extralDelay = items[index - 1].delay
        delay =
            index === 0 ? 0 : (item.autoDelay ? item.timeStamp - items[index - 1].timeStamp : 0);
        // Use a wrapper function to create a Promise that resolves after the delay.
        const processEventWithDelay = (
            index: number,
            cssSelector: string,
            eventType: string,
            value: string,
            waitTime: number,
            tagName: string,
            id: string,
            url: string,
        ) =>
            new Promise<void>((resolve) => {
                setTimeout(async () => {
                    let statusFlag = true;
                    let backMsg = '';
                    switch (eventType) {
                        case "click":
                            const [clickStatusFlag, clickMsgFlag] = await simulateClick(cssSelector);
                            statusFlag = clickStatusFlag as boolean;
                            backMsg = clickMsgFlag as string;
                            break;
                        case "keydown":
                            const [keydownStatusFlag, keyMsgFlag] = await simulateInput(value as string, cssSelector);
                            statusFlag = keydownStatusFlag as boolean;
                            backMsg = keyMsgFlag as string;
                            break;
                        // ...Add any other event types and their corresponding actions here.
                        case "keyboard":
                            const [keyboardStatusFlag, keyboardMsgFlag] = await simulateKeyboardEvent(value as string, cssSelector);
                            statusFlag = keyboardStatusFlag as boolean;
                            backMsg = keyboardMsgFlag as string;
                            break;
                        case 'scroll':
                            const [scrollStatusFlag, scrollMsgFlag] = await scrollPlayer(value);
                            statusFlag = scrollStatusFlag as boolean;
                            backMsg = scrollMsgFlag as string;
                            break;
                        case 'switch':
                            await tabPlayer(id, value, url, eventType, index);
                            break;
                        case 'create':
                            // console.log('create --------------')
                            await tabPlayer(id, value, url, eventType, index);
                            break;
                        case 'visit':
                            // console.log('visit --------------')
                            await tabPlayer(id, value, url, eventType, index);
                            break;
                        default:
                            console.log("Unknown event type:", eventType);
                    }
                    if (!statusFlag) breakFlag = true;
                    sendPlayFeedbackToPopup(statusFlag, backMsg, tagName, id);
                    setTimeout(() => {
                        console.log('delay time: ', new Date().getTime())
                        resolve();
                    }, extralDelay);
                }, waitTime);
            });

        // Use the 'await' keyword to wait for the processEventWithDelay before continuing the loop.
        await processEventWithDelay(index, item.cssSelector, item.eventType,
            item.value, delay, item.tagName, item.id, item.url);

        console.log('end time: ', new Date().getTime());
    }
    clearTabStackHandler();
    stopPlayHandler();
};
