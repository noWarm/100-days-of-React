import { EMPTY_BOARDCELL } from "../constants/board";
import { Orientation, TileProps } from "../types/type";

/**
 * get the initial tile states from a board.
 * will be called only once when a new board is selected
 * @param board
 * @returns
 */
export const GetTilesFromBoard = (board: number[][]) => {
  let boardHeight = board.length;
  let boardWidth = board[0].length;

  let Tiles = new Map<number, TileProps>();

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

        let orientation =
          rowHoles > colHoles ? Orientation.Tall : Orientation.Wide;

        if (rowHoles > colHoles) {
          let tmp = rowHoles;
          rowHoles = colHoles;
          colHoles = tmp;
        }

        Tiles.set(curTileId, {
          id: curTileId,
          row: i,
          col: j,
          rowHoles,
          colHoles,
          orientation,
          Holes: Array.from({ length: rowHoles }, () =>
            Array.from({ length: colHoles }, () => ({ marble: null }))
          ),
        });
      }
    }
  }
  return Tiles;
};
