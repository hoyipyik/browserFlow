import { eventRecorder, removeRecording } from "./util/recorder";

console.log('hello world, content_script.js')

export let autoDelayFlag: boolean[] = [false];
// sendFromContentToBackground('test', { data: 'send test from content_script.js' })

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.channel) {
    console.log("Channel: " + msg.channel);
    recordHandler(msg, sender, sendResponse);
    // playHandler(msg, sender, sendResponse);
    testHandler(msg, sender, sendResponse);
  } else {
    // sendResponse("Color message is none.");
  }
});

const testHandler = (
  msg: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  if (msg.channel === 'test') {
    console.log(msg.data, 'msg received at content_script.js')
    sendResponse('hello from content_script.js')
  }
}

export let isPlaying: boolean;
export let isRecording: boolean;

const onWebPageRefresh = () => {
  console.log('refresh')
  chrome.runtime.sendMessage({ channel: "recorder-status" }, (msg) => {
    if (msg.channel === 'recorder-status') {
      isRecording = msg.isRecording;
      console.log(isRecording, msg, 'recorder status');
    }
    if (isRecording) {
      console.log("*** is recording ***");
      autoDelayFlag = [false];
      eventRecorder();
      console.log('*** recording injecetd ***')
    }
    // console.log("recorder status", isRecording);
  });
};
onWebPageRefresh();
// document.addEventListener('DOMContentLoaded', onWebPageRefresh);

// const playHandler = (
//   msg: any,
//   sender: chrome.runtime.MessageSender,
//   sendResponse: (response?: any) => void
// ) => {
//   if (msg.channel === "player") {
//     isPlaying = msg.data.isPlaying;
//     if (msg.data.isPlaying) {
//       console.log("Start playing", msg.data.list);
//       const listData = msg.data.list as listItem[];
//       eventPlayer(listData);
//       sendResponse('player started');
//     } else {
//       console.log("Stop playing");
//       // removePlaying();
//       sendResponse('player stopped');
//     }
//   }
// };

const recordHandler = (
  msg: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  if (msg.channel === "recorder") {
    isRecording = msg.data.isRecording;
    if (msg.data.isRecording) {
      autoDelayFlag = [false];
      console.log("Start recording");
      eventRecorder();
      sendResponse('recorder started');
    } else {
      console.log("Stop recording");
      removeRecording();
      sendResponse('recorder stopped');
    }
  }
};

/**
 * Status restore function
 * Enble it only when you record single website
 */
// const restoreStatusOnInitial = () => {
//   chrome.storage.local.remove("isRecording", function () {
//     console.log("IsRecording deleted on startup");
//   });
//   chrome.storage.local.remove("isPlaying", function () {
//     console.log("IsPlaying deleted on startup");
//   });
// };

// restoreStatusOnInitial();s;
