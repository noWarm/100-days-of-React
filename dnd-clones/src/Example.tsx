import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";

import { Container } from "./Container";
import { CustomDragLayer } from "./CustomDragLayer";
import { createContext } from "react";
import { Slide, ToastContainer } from "react-toastify";

// const TimerContext = createContext({totalTime: 0, currentTime: 0, isRepeat: false});
export const TimerContext = createContext<{
  value: number;
  setValue: (value: number) => void;

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
  value: 0,
  setValue: () => {},
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

export const Example: FC = () => {
  const [count, setCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isCountDown, setIsCountDown] = useState(false);
  const [fireAlert, setFireAlert] = useState(false);
  const provided = useMemo(
    () => ({
      value: count,
      setValue: (value: number) => setCount(value),
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
    [count, totalTime, currentTime, isRepeat, isCountDown, fireAlert]
  );

  return (
    <div>
      <TimerContext.Provider value={provided}>
        <Container/>
        <CustomDragLayer/>
      </TimerContext.Provider>
    </div>
  );
};
