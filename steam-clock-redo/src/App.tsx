import { FC, useEffect, useMemo, useState } from "react";
import "./App.css";
import { createContext } from "react";
import { Container } from "./components/DragAndDrop/Container";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragLayer } from "./components/DragAndDrop/DragLayer";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const sound = new Audio("sound.wav");

  const notify = () => {
    sound.play();
    toast("Timer Expired!");
  };

  useEffect(() => {
    if (fireAlert) {
      setFireAlert(false);
      notify();
    }
  }, [fireAlert]);

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <TimerContext.Provider value={provided}>
          <Container />
          <DragLayer />
        </TimerContext.Provider>
      </DndProvider>

      <ToastContainer
        position="bottom-right"
        theme="dark"
        transition={Slide}
        hideProgressBar
        autoClose={5000}
      />
    </div>
  );
};
