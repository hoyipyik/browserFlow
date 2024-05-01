import React, { useEffect, useRef, useState } from "react";
import { ListItemProps } from "../types/props.odt";

import "./listItem.css";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { useStore } from "../tools/store";
import { feedbackItem, listItem } from "../types/common.odt";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ChromeMsg, PlayerMsgData } from "../types/chromeMsg.odt";
import useClickOutside from "../hooks/useClickoutside";
import { sendFromPopupToBackground } from "../../util/communication.util";

const ListItem: React.FC<ListItemProps> = ({ item }) => {
  const {
    id,
    timeStamp,
    eventType,
    cssSelector,
    tagName,
    value,
    innerText,
    rawHtml,
    url,
    description,
    delay,
    autoDelay
  } = item;
  const [showDetailsFlag, setShowDetailsFlag] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const list: listItem[] = useStore((state) => state.list);
  const setList = useStore((state) => state.setList);
  const setFeedbackList = useStore((state) => state.setFeedbackList);

  const [eventTypeContent, setEventTypeContent] = useState<string>(eventType);
  const [cssSelectorContent, setCssSelectorContent] =
    useState<string>(cssSelector);
  const [tagNameContent, setTagNameContent] = useState<string>(tagName);
  const [valueContent, setValueContent] = useState<string>(value);
  const [innerTextContent, setInnerTextContent] = useState<string>(innerText);
  const [descriptionContent, setDescriptionContent] =
    useState<string>(description);
  const [delayContent, setDelayContent] = useState<number>(delay as number);
  const [urlContent, setUrlContent] = useState<string>(url);
  const [autoDelayContent, setAutoDelayContent] = useState<boolean>(autoDelay);
  // const [rawHtmlContent, setRawHtmlContent] = useState<string>(rawHtml);

  const ref = useRef(null);

  useEffect(() => {
    setValueContent(item.value);
    setDelayContent(item.delay as number);
    setAutoDelayContent(item.autoDelay);
  }, [item.value, item.delay, isPlaying])

  useEffect(() => {
    const dataListener = function (
      msg: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) {
      if (msg && msg.channel === "player-status") {
        const flag: boolean = msg.data;
        console.log(msg, "*************");
        sendResponse({ message: "State changed!" });
        setIsPlaying(!flag);
      }
    };
    chrome.runtime.onMessage.addListener(dataListener);
    return () => {
      chrome.runtime.onMessage.removeListener(dataListener);
    };
  }, [list, setList, item]);

  const expandMoreHandler = () => {
    setShowDetailsFlag(!showDetailsFlag);
  };

  const hideMoreHanlder = () => {
    setShowDetailsFlag(false);
  };

  const singlePlayHanlder = () => {
    setFeedbackList([] as feedbackItem[]);
    const playerTrigger: PlayerMsgData = {
      isPlaying: !isPlaying,
      list: [item] as listItem[]
    };
    sendFromPopupToBackground('player', playerTrigger);
    setIsPlaying(!isPlaying);
  };

  const listSaveHanler = () => {
    const newList = list.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          eventType: eventTypeContent,
          cssSelector: cssSelectorContent,
          tagName: tagNameContent,
          value: valueContent,
          delay: delayContent,
          description: descriptionContent,
          url: urlContent,
          innerText: innerTextContent,
          autoDelay: autoDelayContent
        };
      }
      return item;
    });
    setList(newList);
    chrome.storage.local.set({ list: newList });
  };

  const listDelteHanlder = () => {
    const newList = list.filter((item) => item.id !== id);
    setList(newList);
  };

  const detailedBoxComponent = (
    <div className="detailBox">
      <div className="select">
        <div>EventType</div>
        <select
          value={eventTypeContent}
          onChange={(e) => setEventTypeContent(e.target.value)}
        >
          <option value="scroll">Scroll</option>
          <option value="keydown">Keydown</option>
          <option value="keyboard">Keyboard</option>
          <option value="click">Click</option>
          <option value="visit">Visit</option>
          <option value="create">Create</option>
          <option value="switch">Switch</option>
        </select>
      </div>
      {(eventTypeContent !== 'scroll' && eventTypeContent !== 'visit' && eventTypeContent !== 'switch' && eventTypeContent !== 'create') &&
        <div className="detail">
          <div>CssSelector</div>
          <div>
            <input
              value={cssSelectorContent}
              onChange={(e) => setCssSelectorContent(e.target.value)}
            />
          </div>
        </div>}
      <div className="detail">
        <div>TagName</div>
        <div>
          <input
            value={tagNameContent}
            onChange={(e) => setTagNameContent(e.target.value)}
          />
        </div>
      </div>
      <div className="delay">
        <div>Auto delay</div>
        <div>
          <input type='checkbox' checked={autoDelayContent} onChange={(event) => setAutoDelayContent(event.target.checked)} />
        </div>
        <div>Delay</div>
        <div>
          <input
            type="number"
            value={delayContent}
            onChange={(e) => setDelayContent(parseInt(e.target.value))}
          />
        </div>
      </div>
      {(eventTypeContent !== 'visit' && eventTypeContent !== 'switch' && eventTypeContent !== 'create') &&
        <div className="detail">
          <div>Value</div>
          <div>
            <input
              value={valueContent}
              onChange={(e) => setValueContent(e.target.value)}
            />
          </div>
        </div>}
      {(eventTypeContent !== 'scroll' && eventTypeContent !== 'visit' && eventTypeContent !== 'switch' && eventTypeContent !== 'create') && <div className="detail">
        <div>InnerText</div>
        <div>
          <input
            value={innerTextContent}
            onChange={(e) => setInnerTextContent(e.target.value)}
          />
        </div>
      </div>}
      <div className="detail">
        <div>Url</div>
        <div>
          <input
            value={urlContent}
            onChange={(e) => setUrlContent(e.target.value)}
          />
        </div>
      </div>
      <div className="detail">
        <div>Description</div>
        <div>
          <textarea
            // disable autosize
            rows={3}
            value={descriptionContent}
            onChange={(e) => setDescriptionContent(e.target.value)}
          />
        </div>
      </div>
      <Button
        className="button"
        sx={{
          marginBottom: "0.6rem",
          marginTop: "0.4rem",
          width: "86%",
          height: "1.4rem",
          fontSize: "small"
        }}
        variant="outlined"
        onClick={listSaveHanler}
      >
        Save
      </Button>
    </div>
  );

  const mainBoxComponent = (
    <div className="mainBox">
      <div />
      <div>
        <div className="eventType">{eventType}</div>
      </div>
      <div className="tabName">{tagName}</div>
      <div>
        <IconButton onClick={singlePlayHanlder}>
          {isPlaying ? (
            <PauseCircleIcon sx={{ zoom: "110%" }} />
          ) : (
            <PlayArrowIcon sx={{ zoom: "110%" }} />
          )}
        </IconButton>
      </div>
      <div>
        <IconButton onClick={listDelteHanlder}>
          <DeleteIcon />
        </IconButton>
      </div>
      <div>
        <IconButton onClick={expandMoreHandler}>
          {showDetailsFlag ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
    </div>
  );

  useClickOutside(ref, hideMoreHanlder);

  return (
    <div ref={ref} className="listItem">
      {mainBoxComponent}
      {showDetailsFlag && detailedBoxComponent}
    </div>
  )}

export default ListItem;