import type { FC } from "react";
import { useCallback, useEffect } from "react";
import { TimeBtn } from "./TimeBtn";
import { useInterval } from "usehooks-ts";
import { ControlBtn } from "./ControlBtn";
import { StartBtn } from "./StartBtn";
import "../../App.css";
import { useAtom } from "jotai";
import {
  currentTimeAtom,
  fireAlertAtom,
  isCountDownAtom,
  isRepeatAtom,
  totalTimeAtom,
} from "../../App";
import { toast } from "react-toastify";

const sound = new Audio("sound.wav");

interface TimerBoxProps {
  isPreview: boolean;
}

export const TimerBox: FC<TimerBoxProps> = ({ isPreview }) => {
  const [totalTime, setTotalTime] = useAtom(totalTimeAtom);
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [isRepeat, setIsRepeat] = useAtom(isRepeatAtom);
  const [isCountDown, setIsCountDown] = useAtom(isCountDownAtom);
  const [fireAlert, setFireAlert] = useAtom(fireAlertAtom);

  const millisecToHours = (t: number) => {
    if (t < 0) return "00";
    const hh = Math.floor(t / 3600000);
    return String(hh).padStart(2, "0");
  };
  const millisecToMinutes = (t: number) => {
    if (t < 0) return "00";
    const hh = Math.floor(t / 3600000);
    const mm = Math.floor((t - 3600000 * hh) / 60000);
    return String(mm).padStart(2, "0");
  };
  const millisecToSeconds = (t: number) => {
    if (t < 0) return "00";
    const hh = Math.floor(t / 3600000);
    const mm = Math.floor((t - 3600000 * hh) / 60000);
    const ss = Math.floor((t - 3600000 * hh - mm * 60000) / 1000);
    return String(ss).padStart(2, "0");
  };

  const repeatOnclickHandler = useCallback(() => {
    setIsRepeat(!isRepeat);
  }, [isRepeat]);

  const resetOnclickHandler = useCallback(() => {
    setCurrentTime(totalTime);
  }, [totalTime]);

  const clearOnclickHandler = useCallback(() => {
    setTotalTime(0);
    setCurrentTime(0);
    setIsCountDown(false);
  }, []);

  const startOnclickHandler = useCallback(() => {
    if (!isCountDown) {
      if (totalTime !== 0) {
        setIsCountDown(true);
      }
    } else {
      setIsCountDown(false);
    }
  }, [isCountDown, totalTime]);

  useInterval(() => {
    if (isCountDown) {
      if (currentTime === 0 && fireAlert === false) {
        setFireAlert(true);
        notify();
      } else if (!isPreview) {
        setCurrentTime(currentTime - 1000);
      }
    }
  }, 1000);

  useEffect(() => {
    if (fireAlert) {
      setCurrentTime(totalTime);
      setFireAlert(false);
      if (!isRepeat) {
        setIsCountDown(false);
      }
    }
  }, [fireAlert, isRepeat]);

  const notify = () => {
    sound.play();
    toast("Timer Expired!");
  };

  return (
    <div className="cursor-default">
      <div className="relative px-2 w-min bg-[#1B1F27]">
        <div className="w-full text-white font-black text-[34px] tracking-wider time-display-font text-center flex justify-between  gap-x-0">
          <div className="w-[48px]">
            <p>{millisecToHours(currentTime)}</p>
          </div>
          <div>
            <p>:</p>
          </div>
          <div className="w-[48px]">
            <p>{millisecToMinutes(currentTime)}</p>
          </div>
          <div>
            <p>:</p>
          </div>
          <div className="w-[48px]">
            <p>{millisecToSeconds(currentTime)}</p>
          </div>
        </div>
        <div className="flex gap-x-2 my-2">
          <TimeBtn text={"1s"} time={1}></TimeBtn>
          <TimeBtn text={"5s"} time={5}></TimeBtn>
          <TimeBtn text={"30s"} time={30}></TimeBtn>
          <TimeBtn text={"1m"} time={60}></TimeBtn>
          <TimeBtn text={"5m"} time={300}></TimeBtn>
        </div>

        <div className="flex gap-x-2 my-2">
          <ControlBtn
            text={"Repeat"}
            onClickHandler={repeatOnclickHandler}
            isRepeatHighlight={isRepeat}
          ></ControlBtn>
          <ControlBtn
            text={"Reset"}
            onClickHandler={resetOnclickHandler}
          ></ControlBtn>
          <ControlBtn
            text={"Clear"}
            onClickHandler={clearOnclickHandler}
          ></ControlBtn>
        </div>

        <div className="flex">
          <StartBtn
            onClickHandler={startOnclickHandler}
            isCountDown={isCountDown}
            disabled={totalTime === 0}
          ></StartBtn>
        </div>
      </div>
    </div>
  );
};
