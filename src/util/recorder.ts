import { sendFromContentToPopup } from "./communication.util";
import { generateRecordItem, generateScrollItem, generateTabItem } from "./record.util";

// var holderArray: any[] = [];
export const eventRecorder = () => {
  document.addEventListener("click", handleMouseClick, true);
  // document.addEventListener("mousedown", handleMouseDown);
  // document.addEventListener('mousemove', handleMouseMove);
  // document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("keydown", handleKeyDown, true);
  document.addEventListener('scroll', handleScroll);
};

export const removeRecording = () => {
  console.log("remove");
  document.removeEventListener("click", handleMouseClick, true);
  // document.removeEventListener("mousedown", handleMouseDown);
  // document.removeEventListener("mouseup", handleMouseUp);
  document.removeEventListener("keydown", handleKeyDown, true);
  document.removeEventListener('scroll', handleScroll);
  // const holder = localStorage.getItem("/array-holder");
  // if (holder !== null) {
  // const holderArray = JSON.parse(holder);
  // console.log(holderArray);
  // return holderArray;
  // }
};

/**
 * Listeners
 */
var isDragging = false;

const handleScroll = (event: any) => {
  const recordItem = generateScrollItem(event);
  try {
    sendFromContentToPopup("recording-item", recordItem);
  } catch (e) {
    console.log("fail", e);
  }
}

function handleMouseClick(event: any) {
  const recordItem = generateRecordItem(event);
  // get all tabs
  try {
    sendFromContentToPopup("recording-item", recordItem);
  } catch (e) {
    console.log("fail", e);
  }
  // localStorage.setItem("/array-holder", JSON.stringify(holderArray));
  console.log("click: ", event);
}

function handleMouseDown(event: any) {
  isDragging = true;
  const recordItem = generateRecordItem(event);
  // holderArray.push(recordItem);
  // localStorage.setItem("/array-holder", JSON.stringify(holderArray));
  // Optionally, store the source element's XPath
  console.log("mousedown: ", recordItem);
}

function handleMouseUp(event: any) {
  if (event.defaultPrevented) {
    console.warn("preventDefault called for mouseup event:", event);
  }
  if (!isDragging) return;
  isDragging = false;
  const recordItem = generateRecordItem(event);
  // const lastItem = holderArray[holderArray.length - 1];
  // if (
  // lastItem.eventType === "mousedown"
  // &&
  // lastItem.xpath === recordItem.xpath &&
  // lastItem.coordinate.x === recordItem.coordinate.x &&
  // lastItem.coordinate.y === recordItem.coordinate.y
  // ) {
  // holderArray.pop();
  recordItem.eventType = "click";
  // }

  // holderArray.push(recordItem);
  // localStorage.setItem("/array-holder", JSON.stringify(holderArray));
  console.log("mouseup: ", recordItem);
}

function handleKeyDown(event: any) {
  if (event.defaultPrevented) {
    console.warn("preventDefault called for mousedown event:", event);
  }
  const recordItem = generateRecordItem(event);

  if (recordItem.value !== "Alt") {
    try {
      sendFromContentToPopup("recording-item", recordItem);
    } catch (e) {
      console.log("fail", e);
    }
  }
  // holderArray.push(recordItem);
  // localStorage.setItem("/array-holder", JSON.stringify(holderArray));
  // Optionally, store the target element's XPath
  console.log("keydown: ", recordItem);
}

export function handleTabUpdated(tabId: number, changeInfo: any, tab: any) {
  if (changeInfo.status === 'complete') {
    console.log(`Switched to tab: ${tabId}`);
    const recordItem = generateTabItem(tab, tabId, 'switch');
    return recordItem;
  }
}

export function onTabCreatedListener(tab: chrome.tabs.Tab) {
  console.log(`New tab opened: ${tab.id}`);
  if (tab.id) {
    const recordItem = generateTabItem(tab, tab.id, 'create');
    try {
      sendFromContentToPopup("recording-item", recordItem);
    } catch (e) {
      console.log(e, 'failed')
    }
  }
}

export const onTabActiveListener = async ({ tabId }: any) => {
  const tab = await new Promise((resolve) => chrome.tabs.get(tabId, resolve));
  const data = handleTabUpdated(tabId, { status: 'complete' }, tab);
  try {
    sendFromContentToPopup("recording-item", data);
  } catch (e) {
    console.log(e, 'failed')
  }
}

export const onTabUpdataListener = (tabId: number, changeInfo: any, tab: any) => {
  if (changeInfo.status === 'complete') {
    console.log(`Switched to tab: ${tabId}`);
    const recordItem = generateTabItem(tab, tabId, 'visit');
    try {
      sendFromContentToPopup("recording-item", recordItem);
    } catch (e) {
      console.log(e, 'failed')
    }
  }
}


