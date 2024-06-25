import React, { FC } from "react";

interface TimeBtnProps {
  text: string;
  onClickHandler: () => void;
}

export const TimeBtn: FC<TimeBtnProps> = ({ text, onClickHandler }) => {
  return (
    <div
      className="relative w-min px-2 py-3 time-ctrl-btn-color"
      onClick={onClickHandler}
    >
      <p className="absolute left-0 top-0 text-xs">+</p>
      <p onClick={onClickHandler} className="">
        {text}
      </p>
    </div>
  );
};
