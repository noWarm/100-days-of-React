import "../App.css";
import ControlBtn from "./ControlBtn.tsx";
import { useEffect, useState } from "react";
import React from "react";
import { useInterval } from "usehooks-ts";
import "react-toastify/dist/ReactToastify.css";
import TimeBtn from "./TimeBtn.tsx";
import StartBtn from "./StartBtn.tsx";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../constants/itemtypes.ts";
import { toast } from "react-toastify";

function Timer({ id, left, top }) {
  const [totalTime, setTotalTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isCountDown, setIsCountDown] = useState(false);
  const [fireAlert, setFireAlert] = useState(false);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.Timer,
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, left, top]
  );
  const notify = () => toast("Timer Expired!");

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

  const addTimeOnClickHandler = (t) => {
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
        setCurrentTime(currentTime - 10);
      }
    }
  }, 10);

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

  const millisecToHours = (t) => {
    const hh = Math.floor(t / 3600000);
    return String(hh).padStart(2, "0");
  };
  const millisecToMinutes = (t) => {
    const hh = Math.floor(t / 3600000);
    const mm = Math.floor((t - 3600000 * hh) / 60000);
    return String(mm).padStart(2, "0");
  };
  const millisecToSeconds = (t) => {
    const hh = Math.floor(t / 3600000);
    const mm = Math.floor((t - 3600000 * hh) / 60000);
    const ss = Math.floor((t - 3600000 * hh - mm * 60000) / 1000);
    return String(ss).padStart(2, "0");
  };

  if (isDragging) {
    return <div ref={drag} />;
  }

  return (
    <div
      ref={drag}
      className="absolute px-2 w-min bg-[#1B1F27]"
      style={{ left, top }}
    >
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
  );
}

export default Timer;
