import React, { useEffect } from "react";
import { feedbackItem } from "../types/common.odt";
import { useStore } from "../tools/store";
import "./resultContainer.css";
import FeedbackItem from "../components/FeedbackItem";
import { IconButton } from "@mui/material";

const ResultContainer = () => {
  const feedbackList: feedbackItem[] = useStore((state) => state.feedbackList);
  const setFeedbackList = useStore((state) => state.setFeedbackList);

  useEffect(() => {
    const dataListener = function (
      msg: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) {
      if (msg && msg.channel === "playing-feedback") {
        console.log(msg, "-------");
        const { flag, message, name, id } = msg;
        const item: feedbackItem = {
          id: id,
          name: name,
          msg: message,
          status: flag
        };
        setFeedbackList([...feedbackList, item]);
        sendResponse(true);
      }
    };
    chrome.runtime.onMessage.addListener(dataListener);
    return () => {
      chrome.runtime.onMessage.removeListener(dataListener);
    };
  }, [feedbackList, setFeedbackList]);

  const feedbackComponent = feedbackList.map(
    (item: feedbackItem, index: number) => {
      return <FeedbackItem item={item} index={index} key={index}/>;
    }
  );

  return <div className="resultContainer">
    {feedbackComponent}
  </div>;
};

export default ResultContainer;
