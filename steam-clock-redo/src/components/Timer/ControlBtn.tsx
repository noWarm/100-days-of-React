import { FC, memo } from "react";

interface ControlBtnProps {
  text: string;
  isRepeatHighlight?: boolean;
  onClickHandler: () => void;
}

export const ControlBtn: FC<ControlBtnProps> = memo(
  ({ text, isRepeatHighlight = false, onClickHandler }) => {
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
);
