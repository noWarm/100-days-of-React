import React, { FC, useMemo, useState } from "react";
import "./App.css";
import { createContext } from "react";
import { TimerBox } from "./components/TimerBox";

export const TimerContext = createContext<{
  totalTime: number;
  setTotalTime: (value: number) => void;
  currentTime: number;
  setCurrentTime: (value: number) => void;
  isRepeat: boolean;
  setIsRepeat: (value: boolean) => void;
  isCountDown: boolean;
  setIsCountDown: (value: boolean) => void;
  fireAlert: boolean;
  setFireAlert: (value: boolean) => void;
}>({
  totalTime: 0,
  setTotalTime: () => {},
  currentTime: 0,
  setCurrentTime: () => {},
  isRepeat: false,
  setIsRepeat: () => {},
  isCountDown: false,
  setIsCountDown: () => {},
  fireAlert: false,
  setFireAlert: () => {},
});

export const App: FC = () => {
  const [totalTime, setTotalTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isCountDown, setIsCountDown] = useState(false);
  const [fireAlert, setFireAlert] = useState(false);

  const provided = useMemo(
    () => ({
      totalTime,
      setTotalTime: (value: number) => setTotalTime(value),
      currentTime,
      setCurrentTime: (value: number) => setCurrentTime(value),
      isRepeat,
      setIsRepeat: (value: boolean) => setIsRepeat(value),
      isCountDown,
      setIsCountDown: (value: boolean) => setIsCountDown(value),
      fireAlert,
      setFireAlert: (value: boolean) => setFireAlert(value),
    }),
    [totalTime, currentTime, isRepeat, isCountDown, fireAlert]
  );

  return (
    <div className="App">
      <TimerContext.Provider value={provided}>
        <TimerBox />
      </TimerContext.Provider>
    </div>
  );
};
