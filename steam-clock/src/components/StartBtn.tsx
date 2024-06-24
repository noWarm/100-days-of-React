import React from "react";

function StartBtn({ isCountDown, onClickHandler, disabled }) {
  if (disabled) {
    return (
      <div
        className="grow text-center w-min px-2 py-3 mb-2 text-[#3C434D] bg-[#1E242D] select-none"
        onClick={onClickHandler}
      >
        Start
      </div>
    );
  } else {
    return (
      <div
        className="grow text-center w-min px-2 py-3 mb-2 text-white bg-gradient-to-r from-[#3A9BED] to-[#235ECF] hover:from-[#47BFFF] hover:to-[#3181E0] active:from-[#45B9FC] active:via-[#2056CB] active:to-[#1A44C2] select-none"
        onClick={onClickHandler}
      >
        {isCountDown ? "Pause" : "Start"}
      </div>
    );
  }
}

export default StartBtn;
