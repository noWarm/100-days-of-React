import "./App.css";
import { BoardContainer } from "./components/board/BoardContainer";
import { atom, useAtomValue } from "jotai";
import { getDefault8x8Board, GetInitGameBoardState } from "./logic/Board";
import { MenuPanel } from "./components/menu/MenuPanel";
import { GetTilesFromBoard } from "./logic/render";
import { LastMarbleMoves, PLAYER, TileProps } from "./types/type";
import { getAllHolePlaceable, getPlaceableHoles } from "./logic/validMove";
import { InGameMenuPanel } from "./components/menu/InGameMenuPanel";
import { ScorePanel } from "./components/score/ScorePanel";
import { GetInitialScore } from "./logic/score";

const default8x8Board = getDefault8x8Board();
const default8x8GameTileState = GetTilesFromBoard(default8x8Board);
export const GameBoardAtom = atom(default8x8Board);
export const GameTileStateAtom = atom(default8x8GameTileState);
// used for storing marbles game state, decoupled from the rotation
export const GameBoardStateAtom = atom(GetInitGameBoardState(default8x8Board));

// use for animation
export const NextGameBoardAtom = atom<number[][] | null>(null);
// used for rendering
export const NextGameTileStateAtom = atom<Map<number, TileProps> | null>(null);
export const TriggerBoardSetupAnimationAtom = atom(false);

export const PlaceableHolesAtom = atom(getAllHolePlaceable(default8x8Board));
export const CurrentPlayerAtom = atom(PLAYER.RED);
export const LastMarbleMovesAtom = atom<LastMarbleMoves>({
  redLast: null,
  blackLast: null,
  lastPlayer: null,
});
export const IsGameEndAtom = atom(false);
export const IsGameStartAtom = atom(false);

export const GameScoreAtom = atom(GetInitialScore())

function App() {
  const isGameStart = useAtomValue(IsGameStartAtom);
  return (
    <div className="relative">
      <div className="absolute top-4 left-4">
        <p className="kulami-logo-display-font text-8xl">Kulami</p>
        <p className="flex justify-end font-mono">
          A <a className="mx-2 underline" href="https://boardgamegeek.com/boardgame/108831/kulami">game</a> by Andreas Kuhnekath
        </p>
      </div>
      <MenuPanel />
      {isGameStart && <InGameMenuPanel />}
      {isGameStart && <ScorePanel />}
      <BoardContainer />
    </div>
  );
}

export default App;
