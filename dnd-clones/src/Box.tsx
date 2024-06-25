import type { CSSProperties, FC } from "react";
import { memo, useContext, useEffect, useState } from "react";
import { TimerContext } from "./Example";
import TimeBtn from "./components/TimeBtn";
import { useInterval } from "usehooks-ts";
import { toast } from "react-toastify";
import ControlBtn from "./components/ControlBtn";
import StartBtn from "./components/StartBtn";
import "./App.css";

const styles: CSSProperties = {
  cursor: "default",
};

export interface BoxProps {
  title: string;
  yellow?: boolean;
  preview?: boolean;
}

export const Box: FC<BoxProps> = ({ preview }) => {
  const {
    currentTime,
    totalTime,
    fireAlert,
    isCountDown,
    isRepeat,
    setCurrentTime,
    setFireAlert,
    setIsCountDown,
    setIsRepeat,
    setTotalTime,
  } = useContext(TimerContext);

  const millisecToHours = (t: number) => {
    const hh = Math.floor(t / 3600000);
    return String(hh).padStart(2, "0");
  };
  const millisecToMinutes = (t: number) => {
    const hh = Math.floor(t / 3600000);
    const mm = Math.floor((t - 3600000 * hh) / 60000);
    return String(mm).padStart(2, "0");
  };
  const millisecToSeconds = (t: number) => {
    const hh = Math.floor(t / 3600000);
    const mm = Math.floor((t - 3600000 * hh) / 60000);
    const ss = Math.floor((t - 3600000 * hh - mm * 60000) / 1000);
    return String(ss).padStart(2, "0");
  };

  const repeatOnclickHandler = () => {
    setIsRepeat(!isRepeat);
  };

  const resetOnclickHandler = () => {
    setCurrentTime(totalTime);
  };

  const clearOnclickHandler = () => {
    setTotalTime(0);
    setCurrentTime(0);
    setIsCountDown(false);
  };

  const addTimeOnClickHandler = (t: number) => {
    t *= 1000;
    setTotalTime(totalTime + t);
    setCurrentTime(currentTime + t);
  };

  const startOnclickHandler = () => {
    if (!isCountDown) {
      if (totalTime !== 0) {
        setIsCountDown(true);
      }
    } else {
      setIsCountDown(false);
    }
  };

  useInterval(() => {
    if (isCountDown) {
      if (currentTime === 0) {
        setFireAlert(true);
      } else {
        setCurrentTime(currentTime - 100);
      }
    }
  }, 100);

  const notify = () => toast("Timer Expired!");

  useEffect(() => {
    if (fireAlert) {
      notify();
      setFireAlert(false);
      setCurrentTime(totalTime);
      if (!isRepeat) {
        setIsCountDown(false);
      }
    }
  }, [fireAlert]);

  return (
    <div style={{ ...styles }} role={preview ? "BoxPreview" : "Box"}>
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
          <TimeBtn
            text={"1s"}
            onClickHandler={() => addTimeOnClickHandler(1)}
          ></TimeBtn>
          <TimeBtn
            text={"5s"}
            onClickHandler={() => addTimeOnClickHandler(5)}
          ></TimeBtn>
          <TimeBtn
            text={"30s"}
            onClickHandler={() => addTimeOnClickHandler(30)}
          ></TimeBtn>
          <TimeBtn
            text={"1m"}
            onClickHandler={() => addTimeOnClickHandler(60)}
          ></TimeBtn>
          <TimeBtn
            text={"5m"}
            onClickHandler={() => addTimeOnClickHandler(300)}
          ></TimeBtn>
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
} ;
