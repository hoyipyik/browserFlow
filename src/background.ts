import { autoDelayFlag } from "./content_script";
import { listItem } from "./renderer/types/common.odt";
import { eventPlayer } from "./util/player";
import { onTabActiveListener, onTabCreatedListener, onTabUpdataListener } from "./util/recorder";

// background.js
let popupWindow: (chrome.windows.Window | undefined);

let popupWindowId: number | undefined;

export let isPlaying: boolean;

export const tabIdMap: Map<string, number> = new Map();

chrome.runtime.onMessage.addListener(
  (msg, sender, sendResponse) => {
    if (msg.channel) {
      console.log(msg.channel, 'channel bg')
      if (msg.channel === 'test') {
        console.log(msg.data)
        sendResponse({ message: "Message received by the background script" });
      }
      if (msg.channel === 'recorder') {
        tabRecordHandler(msg, sender, sendResponse);
      }
      if (msg.channel === 'player') {
        // tabPlayerHandler(msg, sender, sendResponse);
        playHandler(msg, sender, sendResponse);
      }
      if (msg.channel === 'clear-tab-flag') {
        if (msg.data.clearFlag) {
          stackClearHandler()
          sendResponse('tab stack cleared')
        }
      }
    }
    sendResponse(true)
  }
);


const playHandler = (
  msg: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  console.log('& playing')
  isPlaying = msg.data.isPlaying;
  if (msg.data.isPlaying) {
    console.log("Start playing", msg.data.list);
    const listData = msg.data.list as listItem[];
    eventPlayer(listData);
    sendResponse('player started');
  } else {
    console.log("Stop playing");
    // removePlaying();
    sendResponse('player stopped');
  }
}

const tabRecordHandler = (
  msg: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  if (msg.data.isRecording) {
    autoDelayFlag[0] = false;
    chrome.tabs.onCreated.addListener(onTabCreatedListener);
    chrome.tabs.onActivated.addListener(onTabActiveListener);
    chrome.tabs.onUpdated.addListener(onTabUpdataListener);
    sendResponse('tab listener added');
  } else {
    chrome.tabs.onCreated.removeListener(onTabCreatedListener);
    chrome.tabs.onActivated.removeListener(onTabActiveListener);
    chrome.tabs.onUpdated.removeListener(onTabUpdataListener);
    sendResponse('tab listener removed');
  }
}

// const tabPlayerHandler = (
//   msg: any,
//   sender: chrome.runtime.MessageSender,
//   sendResponse: (response?: any) => void
// ) => {
//   const { url, id, tabId, action } = msg.data
//   if (action === 'visit') {
//     console.log('tab play visit')
//     chrome.tabs.query({ active: true }, function (tabs: any) {
//       tabs = tabs.filter((e: any) => {
//         if (e.pendingUrl && e.pendingUrl === "chrome-extension://gikinjmhoehdoildnpeboogagmofhheo/popup.html") {
//           return false;
//         }
//         return true;
//       })
//       const tabId = tabs[0].id;
//       console.log(tabId, 'tab id test')
//       chrome.tabs.update(tabId, { url: url });
//     });
//   }
//   if (action === 'create') {
//     chrome.tabs.create({ url: url });
//     // get the id of the created tab
//     // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
//     //   let currentTab = tabs[0];
//     //   chrome.tabs.update(currentTab.id, { url: url });
//   }
//   if (action === 'switch') {
//     // chrome.tabs.update(tabId, { active: true });
//   }
//   sendResponse('tab play done')
// }

const stackClearHandler = () => {
  tabIdMap.clear();
  console.log('stack cleared');
}

// function replayTabs() {
//   recordedTabs.forEach((recordedTab) => {
//     if (recordedTab.action === 'open') {
//       chrome.tabs.create({ url: recordedTab.url }, (tab) => {
//         console.log(`Reopened tab: ${tab?.id}`);
//       });
//     } else if (recordedTab.action === 'switch') {
//       chrome.tabs.update(recordedTab.tabId, { active: true }, (tab) => {
//         console.log(`Reswitched to tab: ${tab?.id}`);
//       });
//     }
//   });
// }

// // Listen for tab opening events

// // Listen for tab switching events
// // chrome.action.onClicked.addListener(replayTabs);


// Register the action when the extension's icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (!tab) {
    return;
  }
  console.log('background js');

  const windowWidth = 400;
  const windowHeight = 700;

  chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
    chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: windowWidth,
      height: windowHeight,
      // left: 1592
    }, async (window) => {
      popupWindow = window;
      if (popupWindow) {
        popupWindowId = popupWindow.id;
        // console.log(popupWindowId);
        // sendFromBackgroundToContent('test', 'hi')
      }
    });
  });
});



// test from background to popup

// setTimeout(async () => {
//   console.log('start count')
//   sendFromBackgroundToPopup("test", "Hello from backgroud to popup");
//   console.log('stop count')
// }, 10000);