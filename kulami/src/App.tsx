import { CSSProperties, FC } from "react";
import "./App.css";

const DefaultBoard8x8 = [
  [0, 0, 1, 2, 2, 2, 3, 3],
  [0, 0, 1, 4, 4, 5, 3, 3],
  [6, 6, 1, 4, 4, 5, 3, 3],
  [6, 6, 7, 7, 7, 8, 8, 8],
  [9, 9, 7, 7, 7, 10, 10, 11],
  [12, 13, 13, 14, 14, 10, 10, 11],
  [12, 13, 13, 15, 15, 15, 16, 16],
  [12, 13, 13, 15, 15, 15, 16, 16],
];

const GAP_SIZE_PX = 4;
const HOLE_PADDING_SIZE_PX = 8;
const HOLE_SIZE_PX = 32;
const TILE_LENGTH_PX = HOLE_PADDING_SIZE_PX * 2 + HOLE_SIZE_PX;
const BOARD_SIZE = 8;

const GetTilesFromBoard = (board: number[][]) => {
  let curMaxTileId = -1;

  let Tiles = new Set<TileProps>();

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

        Tiles.add({
          id: curTileId,
          row: i,
          col: j,
          rowHoles,
          colHoles,
        });
        curMaxTileId = curTileId;
      }
    }
  }
  return Tiles;
};

const renderBoard = (tiles: Set<TileProps>) => {
  const width = BOARD_SIZE * TILE_LENGTH_PX + (BOARD_SIZE-1) * GAP_SIZE_PX;
  const height = BOARD_SIZE * TILE_LENGTH_PX + (BOARD_SIZE-1) * GAP_SIZE_PX;
  const style: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
  };
  return (
    <div className="relative" style={style}>
      {Array.from(tiles).map((el) => (
        <Tile {...el} />
      ))}
    </div>
  );
};

const Hole = () => {
  const style: CSSProperties = {
    padding: `${HOLE_PADDING_SIZE_PX}px`,
  };

  return (
    <div className="relative" style={style}>
      <div className={`rounded-full bg-[#D7C0AB] w-[32px] h-[32px]`}></div>
    </div>
  );
};

const Tile: FC<TileProps> = ({ id, row, col, rowHoles, colHoles }) => {
  const style: CSSProperties = {
    position: "absolute",
    display: "grid",
    gridTemplateColumns: `repeat(${colHoles}, 1fr)`,
    gridGap: `${GAP_SIZE_PX}px`,
    top: `${row * TILE_LENGTH_PX + row * GAP_SIZE_PX}px`,
    left: `${col * TILE_LENGTH_PX + (col - 1) * GAP_SIZE_PX}px`,
  };

  return (
    <div
      className={` bg-[#F2DBC2]  hover:outline-white hover:outline transition-all duration-75 rounded-sm`}
      style={style}
    >
      {[...Array(rowHoles * colHoles).keys()].map(() => (
        <Hole />
      ))}
    </div>
  );
};

interface TileProps {
  id: number;
  row: number;
  col: number;
  rowHoles: number;
  colHoles: number;
}

function App() {
  let tiles = GetTilesFromBoard(DefaultBoard8x8);
  console.log([...tiles.entries()]);
  return (
    <div>
      <div className="flex justify-center text-center items-center min-h-screen">
        <div>
          {renderBoard(tiles)}
        </div>
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
