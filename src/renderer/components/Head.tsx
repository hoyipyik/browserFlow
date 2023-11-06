import React, { useEffect } from "react";
import "./head.css";
import { Button, IconButton } from "@mui/material";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import VideocamIcon from "@mui/icons-material/Videocam";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { useStore } from "../tools/store";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  PlayerMsgData,
  RecorderMsgData
} from "../types/chromeMsg.odt";
import { feedbackItem, listItem } from "../types/common.odt";
import { sendFromPopupToBackground, sendFromPopupToContent } from "../../util/communication.util";

const Head = () => {
  // Get the isRecording state and setIsRecording function from the store
  const isRecording = useStore((state) => state.isRecording);
  const setIsRecording = useStore((state) => state.setIsRecording);
  // Get the isPlaying state and setIsPlaying function from the store
  const isPlaying = useStore((state) => state.isPlaying);
  const setIsPlaying = useStore((state) => state.setIsPlaying);
  // Get the list state and setList function from the store
  const setList = useStore((state) => state.setList);
  const list: listItem[] = useStore((state) => state.list);
  const setFeedbackList = useStore((state) => state.setFeedbackList);

  const setAddPageFlag = useStore((state) => state.setAddPageFlag);
  const setAddIndex = useStore((state) => state.setAddIndex);
  const addPageFlag: boolean = useStore((state) => state.addPageFlag);

  useEffect(() => {
    const dataListener = function (
      msg: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) {
      if (msg && msg.channel === "recording-item") {
        const newItem: listItem = msg.data;
        sendResponse({ message: "Data received!" });
        dataProcessor(newItem);
      }
      if (msg && msg.channel === "player-status") {
        const flag: boolean = msg.data;
        console.log(msg, "*************");
        sendResponse({ message: "State changed!" });
        setIsPlaying(!flag);
      }
      if (msg && msg.channel === "recorder-status") {
        sendResponse({ channel: 'recorder-status', isRecording: isRecording });
        console.log(isRecording, '--------')
      }
    };
    chrome.runtime.onMessage.addListener(dataListener);
    return () => {
      chrome.runtime.onMessage.removeListener(dataListener);
    };
  }, [list, setList, isRecording]);

  // useEffect(() => {
  //   chrome.runtime.sendMessage(
  //     // 'gikinjmhoehdoildnpeboogagmofhheo',
  //     { action: "exampleAction", data: "exampleData" },
  //     (response) => {
  //       console.log(response);
  //     }
  //   );
  // }, []);


  // useEffect(() => {
  //   const getMessageFromBackground = (
  //     msg: any,
  //     sender: chrome.runtime.MessageSender,
  //     sendResponse: (response?: any) => void
  //   ) => {
  //     console.log(msg, 'test')
  //     sendResponse('test success from frontend')
  //   }
  //   chrome.runtime.onMessage.addListener(getMessageFromBackground);
  //   return (() => { chrome.runtime.onMessage.removeListener(getMessageFromBackground) })
  // }, [])

  // const generateStartVisit = (newItem: listItem) => {
  //   const visitItem = { ...newItem };
  //   visitItem.eventType = 'visit';
  //   visitItem.cssSelector = '';
  //   visitItem.description = '';
  //   visitItem.innerText = '';
  //   visitItem.rawHtml = '';
  //   visitItem.tagName = 'New Window';
  //   visitItem.timeStamp = newItem.timeStamp - 1;
  //   visitItem.id = newItem.id + "visit_start";
  //   return visitItem;
  // }

  const addItemHandler = () => {
    setAddIndex(-1);
    setAddPageFlag(!addPageFlag);
  }

  const dataProcessor = (newItem: listItem) => {
    if (list.length !== 0 && newItem.eventType) {
      if (list[list.length - 1].eventType === "create" && newItem.eventType === 'switch' && newItem.tagName === 'New Tab') {
        console.log(newItem, 'remove useless switch')
        return;
      }
      if (newItem.eventType === 'visit' && newItem.tagName === 'New Tab') {
        console.log(newItem, 'remove useless visit 1')
        return;
      }

      if (newItem.eventType === 'visit'
        && list[list.length - 1].eventType !== 'switch'
        && list[list.length - 1].eventType !== 'visit'
        && list[list.length - 1].eventType !== 'create') {
        console.log(newItem, 'remove useless visit 2')
        const secondLastItem = list[list.length - 2];
        const lastItem = list[list.length - 1];
        secondLastItem.delay = 6000;
        const newList = [...list.slice(0, list.length - 2), secondLastItem, lastItem];
        setList(newList);
        chrome.storage.local.set({ list: newList });
        return;
      }
      if (
        newItem.eventType === "keydown" &&
        list[list.length - 1].eventType === "keydown" &&
        list[list.length - 1].cssSelector === newItem.cssSelector
      ) {
        console.log("merge keydown");
        const lastIndex = list.length - 1;
        const lastItem = list[lastIndex];
        lastItem.value += newItem.value;
        console.log('lastItem', lastItem);
        const newList = [...list.slice(0, lastIndex), lastItem];
        setList(newList);
        chrome.storage.local.set({ list: newList });
        return;
      }

      // if (newItem.eventType === 'scroll' &&
      //   list[list.length - 1].eventType === 'scroll') {
      //   console.log('merge scroll')
      //   const lastIndex = list.length - 1;
      //   const lastItem = list[lastIndex];
      //   lastItem.value = newItem.value;
      //   const newList = [...list.slice(0, lastIndex), lastItem];
      //   setList(newList);
      //   chrome.storage.local.set({ list: newList });
      //   return;
      // }
    }
    // if (list.length === 0 && (newItem.eventType === 'visit' || newItem.eventType === 'switch' || newItem.eventType === 'create')) {
    //   setList([...list, generateStartVisit(newItem), newItem]);
    //   chrome.storage.local.set({ list: [...list, generateStartVisit(newItem), newItem] });
    // } else {
    setList([...list, newItem]);
    chrome.storage.local.set({ list: [...list, newItem] });
    // }
  }

  // Export the JSON
  const exportHandler = () => {
    const dataStr = JSON.stringify({ list: list }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    // Append the anchor element to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the blob URL
    URL.revokeObjectURL(url);
  };

  // useEffect(() => {
  //   const poolingSend = (value: boolean) => {
  //     const recorderTrigger: RecorderMsgData = {
  //       isRecording: value
  //     };
  //     const sendData: ChromeMsg = {
  //       channel: "recorder",
  //       data: recorderTrigger
  //     };
  //     // Send the message to the content script
  //     chrome.tabs.query({ active: true }, function (tabs) {
  //       // console.log(tabs);
  //       if (tabs) {
  //         for (const tab of tabs) {
  //           try {
  //             chrome.tabs.sendMessage(tab.id as number, sendData, (msg) => {
  //               console.log("result message:", msg);
  //             });
  //           } catch (err) {
  //             console.log(err);
  //           }
  //         }
  //       }
  //     });
  //   };
  //   const interval = setInterval(() => {
  //     if (isRecording) {
  //       poolingSend(true);
  //       // poolingSend(false);
  //     }
  //   }, 100);
  // }, [isRecording]);

  // Handler function for the record button
  const recordHandler = () => {
    // Create a message to send to the content script to start recording
    const recorderTrigger: RecorderMsgData = {
      isRecording: !isRecording
    };
    sendFromPopupToBackground('recorder', recorderTrigger);
    try {
      sendFromPopupToContent('recorder', recorderTrigger);
    } catch (e) { console.log(e, 'tab inject fail') }
    setIsRecording(!isRecording);
    setIsPlaying(false);
  };

  // Handler function for the play button
  const playAllHandler = () => {
    if (list) {
      setFeedbackList([] as feedbackItem[]);
      const playerTrigger: PlayerMsgData = {
        isPlaying: !isPlaying,
        list: list as listItem[]
      };
      sendFromPopupToBackground('player', playerTrigger);
      //   console.log(tabs);
      //   if (tabs) {
      //     for (const tab of tabs) {
      //       try {
      //         chrome.tabs.sendMessage(tab.id as number, sendData, (msg) => {
      //           console.log("result message:", msg);
      //         });
      //       } catch (err) {
      //         console.log(err, "error ****");
      //       }
      //     }
      //   }
      // });
      setIsPlaying(!isPlaying);
      setIsRecording(false);
    }
  };

  const deleteAllHandler = () => {
    setList([] as listItem[]);
    chrome.storage.local.set({ list: [] });
  };

  return (
    <div className="head">
      {/* Record button */}
      <Button
        sx={{ width: "6rem", height: "2.7rem" }}
        color={isRecording ? "secondary" : "primary"}
        startIcon={isRecording ? <StopCircleIcon /> : <VideocamIcon />}
        variant="outlined"
        onClick={recordHandler}
      >
        {isRecording ? "Stop" : "Start"}
      </Button>

      {/* Play button */}
      <IconButton
        onClick={playAllHandler}
        sx={{ marginLeft: "0.5rem", zoom: "110%", height: "2.7rem" }}
      >
        {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
      </IconButton>

      {/* Skip button */}
      <IconButton
        sx={{ marginLeft: "0.2rem", height: "2.7rem" }}
        onClick={exportHandler}
      >
        <DownloadIcon sx={{ zoom: "120%" }} />
      </IconButton>

      {/* Delete button */}
      <IconButton
        sx={{ marginLeft: "0.2rem", zoom: "110%", height: "2.7rem" }}
        onClick={deleteAllHandler}
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        sx={{ marginLeft: "0.2rem", zoom: "110%", height: "2.7rem" }}
        onClick={addItemHandler}
      >
        {addPageFlag ? <HighlightOffIcon color={'primary'} />
          : <AddCircleIcon color={"primary"} />
        }
      </IconButton>
    </div>
  );
};

export default Head;
