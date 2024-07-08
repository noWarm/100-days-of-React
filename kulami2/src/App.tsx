import "./App.css";
import { BoardContainer } from "./components/board/BoardContainer";
import { atom } from "jotai";
import { getDefault8x8Board } from "./logic/Board";
import { MenuPanel } from "./components/menu/MenuPanel";
import { GetTilesFromBoard } from "./logic/render";
import { LastMarbleMoves, PLAYER } from "./types/type";
import { getAllHolePlaceable, getPlaceableHoles } from "./logic/validMove";

const default8x8Board = getDefault8x8Board();
const default8x8GameTileState = GetTilesFromBoard(default8x8Board);
export const GameBoardAtom = atom(default8x8Board);
export const GameTileStateAtom = atom(default8x8GameTileState);
export const PlaceableHolesAtom = atom(getAllHolePlaceable(default8x8Board));
export const CurrentPlayerAtom = atom(PLAYER.RED);
export const LastMarbleMovesAtom = atom<LastMarbleMoves>({
  redLast: null,
  blackLast: null,
  lastPlayer: null,
});
export const IsGameEndAtom = atom(false);
export const IsGameStartAtom = atom(false);

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
