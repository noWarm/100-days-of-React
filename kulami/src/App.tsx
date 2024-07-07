import { CSSProperties, useEffect } from "react";
import "./App.css";
import {
  BOARD_SIZE,
  DefaultBoard8x8,
  DefaultIrregularBoard,
  GAP_SIZE_PX,
  MAX_BOARD_SIZE,
  PLAYER,
  TILE_LENGTH_PX,
} from "./constants/render";
import { Tile, TileProps } from "./components/Tile";
import { atom, useAtom, useAtomValue } from "jotai";
import {
  getAllHoles,
  getGeneralPlaceableHoles,
  getPlaceableHoles,
} from "./logic/validMove";
import { GetRandomizedTileBoard } from "./logic/randomizer";

const GetTilesFromBoard = (board: number[][]) => {
  let curMaxTileId = -1;

  let Tiles = new Map<number, TileProps>();
  let HoleMapTileId = Array.from({ length: BOARD_SIZE }, () =>
    new Array(BOARD_SIZE).fill(0)
  );

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] > curMaxTileId) {
        let curTileId = board[i][j];
        let rowHoles = 1;
        while (
          i + rowHoles < BOARD_SIZE &&
          board[i + rowHoles][j] == curTileId
        ) {
          rowHoles++;
        }
        let colHoles = 1;
        while (
          j + colHoles < BOARD_SIZE &&
          board[i][j + colHoles] == curTileId
        ) {
          colHoles++;
        }

        Tiles.set(curTileId, {
          id: curTileId,
          row: i,
          col: j,
          rowHoles,
          colHoles,
          Holes: Array.from({ length: rowHoles }, () =>
            Array.from({ length: colHoles }, () => ({ marble: null }))
          ),
        });
        for (let _pi = 0; _pi < rowHoles; _pi++) {
          for (let _pj = 0; _pj < colHoles; _pj++) {
            HoleMapTileId[i + _pi][j + _pj] = curTileId;
          }
        }
        curMaxTileId = curTileId;
      }
    }
  }
  return { HoleMapTileId, Tiles };
};

const renderBoard = (tiles: Map<number, TileProps>) => {
  const width = BOARD_SIZE * TILE_LENGTH_PX + (BOARD_SIZE - 1) * GAP_SIZE_PX;
  const height = BOARD_SIZE * TILE_LENGTH_PX + (BOARD_SIZE - 1) * GAP_SIZE_PX;
  const style: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
  };
  return (
    <div className="relative" style={style}>
      {Array.from(tiles).map((el) => (
        <Tile {...el[1]} />
      ))}
    </div>
  );
};

const GetTilesFromGeneralBoard = (board: (number | string)[][]) => {
  let curMaxTileId = -1;

  let Tiles = new Map<number, TileProps>();
  let HoleMapTileId = Array.from({ length: MAX_BOARD_SIZE }, () =>
    new Array(MAX_BOARD_SIZE).fill(0)
  );

  for (let i = 0; i < MAX_BOARD_SIZE; i++) {
    for (let j = 0; j < MAX_BOARD_SIZE; j++) {
      if (typeof board[i][j] !== "number") continue;
      if ((board[i][j] as number) > curMaxTileId) {
        let curTileId = board[i][j] as number;
        let rowHoles = 1;
        while (
          i + rowHoles < MAX_BOARD_SIZE &&
          board[i + rowHoles][j] == curTileId
        ) {
          rowHoles++;
        }
        let colHoles = 1;
        while (
          j + colHoles < MAX_BOARD_SIZE &&
          board[i][j + colHoles] == curTileId
        ) {
          colHoles++;
        }

        Tiles.set(curTileId, {
          id: curTileId,
          row: i,
          col: j,
          rowHoles,
          colHoles,
          Holes: Array.from({ length: rowHoles }, () =>
            Array.from({ length: colHoles }, () => ({ marble: null }))
          ),
        });
        for (let _pi = 0; _pi < rowHoles; _pi++) {
          for (let _pj = 0; _pj < colHoles; _pj++) {
            HoleMapTileId[i + _pi][j + _pj] = curTileId;
          }
        }
        curMaxTileId = curTileId;
      }
    }
  }
  return { HoleMapTileId, Tiles };
};

// todo: center it around the bounding box center
const renderGeneralBoard = (tiles: Map<number, TileProps>) => {
  console.log("render general board");
  const width =
    MAX_BOARD_SIZE * TILE_LENGTH_PX + (MAX_BOARD_SIZE - 1) * GAP_SIZE_PX;
  const height =
    MAX_BOARD_SIZE * TILE_LENGTH_PX + (MAX_BOARD_SIZE - 1) * GAP_SIZE_PX;
  const style: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
  };
  return (
    <div className="relative" style={style}>
      {Array.from(tiles).map((el) => (
        <Tile {...el[1]} />
      ))}
    </div>
  );
};

export interface LastMarble {
  row: number | undefined;
  col: number | undefined;
  tileId: number | undefined;
}

export interface LastMarbleMoves {
  redLast: LastMarble | null;
  blackLast: LastMarble | null;
  lastPlayer: PLAYER | null;
}

export const CurrentPlayerAtom = atom(PLAYER.RED);
export const LastMarbleMovesAtom = atom<LastMarbleMoves>({
  redLast: null,
  blackLast: null,
  lastPlayer: null,
});

let GameBoardInUsed = DefaultBoard8x8;

export const { HoleMapTileId, Tiles: GameTileState } =
  GetTilesFromGeneralBoard(GameBoardInUsed);
export const GameTileStateAtom = atom(GameTileState);
export const PlaceableHolesAtom = atom(getAllHoles());
export const IsGameEndAtom = atom(false);

// console.log(GetRandomizedTileBoard());

function App() {
  const [placeableHoles, setPlaceableHoles] = useAtom(PlaceableHolesAtom);
  const [gameTileState, setGameTileState] = useAtom(GameTileStateAtom);
  const [currentPlayer, setCurrentPlayer] = useAtom(CurrentPlayerAtom);
  const lastMarbleMoves = useAtomValue(LastMarbleMovesAtom);
  const [isGameEnd, setIsGameEnd] = useAtom(IsGameEndAtom);

  // useEffect(() => {
  //   let placeableHoles = getGeneralPlaceableHoles(lastMarbleMoves);
  //   setPlaceableHoles(placeableHoles);
  //   if (placeableHoles.length == 0) {
  //     setIsGameEnd(true);
  //   }
  // }, [gameTileState]);

  const animatePiece = () => {};

  // const randomBoardHandler = () => {
  //   let { HoleMapTileId, Tiles: GameTileState } = GetTilesFromGeneralBoard(DefaultIrregularBoard);
  //   setGameTileState(GameTileState);
  // };

  // const setDefaultBoardHandler = () => {
  //   let { HoleMapTileId, Tiles: GameTileState } = GetTilesFromBoard(DefaultBoard8x8);
  //   setGameTileState(GameTileState);
  // }

  return (
    <div>
      {/* <button className="border border-white" onClick={animatePiece}>
        Animate Piece
      </button> */}
      {/*<div className="flex justify-center text-center items-center min-h-screen">
        <div>{renderBoard(GameTileState)}</div>
        </div>*/}
      <div className="flex flex-col justify-center text-center items-center min-h-screen">
        <div>
          {/* <button className="border border-white my-4 mx-2" onClick={randomBoardHandler}>
            Random
          </button>
          <button className="border border-white my-4m x-2" onClick={setDefaultBoardHandler}>
            Default
          </button> */}
        </div>
        <div>{renderGeneralBoard(GameTileState)}</div>
      </div>
    </div>
  );
}

export default App;

// - do 8 x 8
/*
  - row, col
  - x, y
  - handle spacing
*/
// - auto generate irregular 10 x 10
