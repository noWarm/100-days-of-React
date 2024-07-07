import "./App.css";
import { BoardContainer } from "./components/board/BoardContainer";
import { atom } from "jotai";
import { getDefault8x8Board} from "./logic/Board";
import { MenuPanel } from "./components/menu/MenuPanel";

export const GameBoardAtom = atom(getDefault8x8Board());
function App() {
  return (
    <>
      <div className="absolute top-4 left-4">
        <p className="kulami-logo-display-font text-8xl">Kulami</p>
        <p className="flex justify-end font-mono">
          A game by Andreas Kuhnekath
        </p>
      </div>
      <MenuPanel />
      <BoardContainer />
    </>
  );
}

export default App;
