import { useAtom } from "jotai";
import { FC, useCallback } from "react";
import { currentTimeAtom, totalTimeAtom } from "../../App";
import { MAX_TIME } from "../../constants/time";

interface TimeBtnProps {
  text: string;
  time: number;
}

export const TimeBtn: FC<TimeBtnProps> = ({ text, time }) => {
  const [totalTime, setTotalTime] = useAtom(totalTimeAtom);
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);

  const addTimeOnClickHandler = () => {
    let t = time * 1000;
    let newTotalTime = totalTime + t > MAX_TIME ? MAX_TIME : totalTime + t;
    let newCurrentTime =
      currentTime + t > MAX_TIME ? MAX_TIME : currentTime + t;
    setTotalTime(newTotalTime);
    setCurrentTime(newCurrentTime);
  };

  return (
    <div
      className="relative w-min px-2 py-3 time-ctrl-btn-color"
      onClick={addTimeOnClickHandler}
    >
      <p className="absolute left-0 top-0 text-xs">+</p>
      <p>{text}</p>
    </div>
  );
};
