import React, { useRef } from "react";
import { FeedbackItemProps } from "../types/props.odt";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import "./feedbackItem.css";
import useClickOutside from "../hooks/useClickoutside";

const FeedbackItem: React.FC<FeedbackItemProps> = ({ item, index }) => {
  const { id, name, msg, status } = item;
  const ref = useRef(null);

  const [showMsg, setShowMsg] = React.useState<boolean>(false);

  const clickoutsideHandler = () => {
    setShowMsg(false);
  };

  const onClickHandler = () => {
    setShowMsg(true);
  };

  useClickOutside(ref, clickoutsideHandler);

  return (
    <div className="feedbackItem" key={index + "32" + id} ref={ref}>
      <div className="main-container" onClick={onClickHandler}>
        <div />
        <div>{`Step: ${index + 1}`}</div>
        <div>{name}</div>
        <div>
          {status ? (
            <CheckIcon sx={{ fill: "green", zoom: "90%" }} />
          ) : (
            <ClearIcon sx={{ fill: "red", zoom: "90%" }} />
          )}
        </div>
      </div>
      {showMsg && msg !== "" && <div className="msg">{msg}</div>}
    </div>
  );
};

export default FeedbackItem;
