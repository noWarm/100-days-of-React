import React from "react";

function ControlBtn({ text, onClickHandler, isRepeatHighlight = false }) {
  if (isRepeatHighlight) {
    return (
      <div
        className="grow py-3 repeat-highlight text-center"
        onClick={onClickHandler}
      >
        {text}
      </div>
    );
  } else {
    return (
      <div
        className="grow py-3 time-ctrl-btn-color text-center"
        onClick={onClickHandler}
      >
        {text}
      </div>
    );
  }
}

export default ControlBtn;
