import { EMPTY_BOARDCELL } from "../constants/board";
import {
  GameCellState,
  LastMarbleMoves,
  PLAYER,
  TileProps,
} from "../types/type";
import { printBoard } from "./Board";

export const getAllHolePlaceable = (board: number[][]) => {
  let boardHeight = board.length;
  let boardWidth = board[0].length;
  return Array.from({ length: boardHeight }, () =>
    Array.from({ length: boardWidth }, () => true)
  );
};

/**
 * get all the placeable hole position based on the last move.
 * afterwards, the component will highlight, dehighlight cells based
 * on the returned values.
 * @param lastMarbleMove
 * @returns
 */
export const getPlaceableHoles = (
  board: number[][],
  gameBoardState: GameCellState[][],
  lastMarbleMove: LastMarbleMoves
): boolean[][] => {
  let boardHeight = board.length;
  let boardWidth = board[0].length;

  let lastPlayerMove = lastMarbleMove.lastPlayer;
  if (lastPlayerMove == null) {
    return getAllHolePlaceable(board);
  }

  let placeableGrid = Array.from({ length: boardHeight }, () =>
    Array.from({ length: boardWidth }, () => false)
  );

  let lastRow: number;
  let lastCol: number;
  let lastBlackTileId: number | null = null;
  let lastRedTileId: number | null = null;
  if (lastPlayerMove == PLAYER.BLACK) {
    if (lastMarbleMove.blackLast === null) {
      throw new Error("invalid blacklast");
    }
    lastRow = lastMarbleMove.blackLast.row;
    lastCol = lastMarbleMove.blackLast.col;
    lastBlackTileId = lastMarbleMove.blackLast.tileId;

    if (lastMarbleMove.redLast === null) {
      throw new Error("red always move first");
    }
    lastRedTileId = lastMarbleMove.redLast.tileId;
  } else {
    if (lastMarbleMove.redLast === null) {
      throw new Error("invalid redlast");
    }
    lastRow = lastMarbleMove.redLast.row;
    lastCol = lastMarbleMove.redLast.col;
    lastRedTileId = lastMarbleMove.redLast.tileId;

    if (lastMarbleMove.blackLast !== null) {
      lastBlackTileId = lastMarbleMove.blackLast.tileId;
    }
  }

  printBoard(board);

  // search vertically at lastCol
  for (let i = 0; i < boardHeight; i++) {
    let inspectingTileId = board[i][lastCol];
    if (board[i][lastCol] === EMPTY_BOARDCELL) continue;
    if (inspectingTileId === undefined) {
      throw new Error("invalid inspecting tile id");
    }
    // if the cell is empty
    // if it's not same tile as last black
    // if it's not same tile as last red

    if (
      gameBoardState[i][lastCol].marble === null &&
      (lastBlackTileId === null || inspectingTileId != lastBlackTileId) &&
      (lastRedTileId === null || inspectingTileId != lastRedTileId)
    ) {
      placeableGrid[i][lastCol] = true;
    }
  }

  // search horizontally at lastRow
  for (let i = 0; i < boardWidth; i++) {
    let inspectingTileId = board[lastRow][i];
    if (board[lastRow][i] === EMPTY_BOARDCELL) continue;
    if (inspectingTileId === undefined) {
      throw new Error("invalid inspecting tile id");
    }
    if (
      gameBoardState[lastRow][i].marble === null &&
      (lastBlackTileId === null || inspectingTileId != lastBlackTileId) &&
      (lastRedTileId === null || inspectingTileId != lastRedTileId)
    ) {
      placeableGrid[lastRow][i] = true;
    }
  }
  return placeableGrid;
};
