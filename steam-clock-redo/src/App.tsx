import { FC, useEffect } from "react";
import "./App.css";
import { Container } from "./components/DragAndDrop/Container";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragLayer } from "./components/DragAndDrop/DragLayer";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider, atom, useAtom } from "jotai";

export const totalTimeAtom = atom(0);
export const currentTimeAtom = atom(0);
export const isRepeatAtom = atom(false);
export const isCountDownAtom = atom(false);
export const fireAlertAtom = atom(false);

export const App: FC = () => {
  const [fireAlert, setFireAlert] = useAtom(fireAlertAtom);

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
        <Provider>
          <Container />
          <DragLayer />
        </Provider>
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
