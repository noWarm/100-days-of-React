import { EMPTY_BOARDCELL } from "../constants/board";
import { TileProps } from "../types/type";

export const GetTilesFromBoard = (board: number[][]) => {
  let curMaxTileId = -1;

  let boardHeight = board.length;
  let boardWidth = board[0].length;

  let Tiles = new Map<number, TileProps>();
  let HoleMapTileId = Array.from({ length: boardHeight }, () =>
    new Array(boardWidth).fill(-1)
  );

  for (let i = 0; i < boardHeight; i++) {
    for (let j = 0; j < boardWidth; j++) {
      if (board[i][j] == EMPTY_BOARDCELL) continue;
      if (!Tiles.has(board[i][j])) {
        let curTileId = board[i][j];
        let rowHoles = 1;
        while (
          i + rowHoles < boardHeight &&
          board[i + rowHoles][j] == curTileId
        ) {
          rowHoles++;
        }
        let colHoles = 1;
        while (
          j + colHoles < boardWidth &&
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
  console.log(HoleMapTileId);
  return { HoleMapTileId, Tiles };
};
