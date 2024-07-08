import { EMPTY_BOARDCELL } from "../constants/board";
import { LastMarbleMoves, PLAYER, TileProps } from "../types/type";

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
  gameTileState: Map<number, TileProps>,
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
  let lastTileId: number;
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
      throw new Error ("red always move first");
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

  // search vertically at lastCol
  for (let i = 0; i < boardHeight; i++) {
    let inspectingTileId = gameTileState.get(board[i][lastCol]);
    if (board[i][lastCol] === EMPTY_BOARDCELL) continue;
    if (inspectingTileId === undefined) {
      throw new Error("invalid inspecting tile id");
    }
    if (
      inspectingTileId.Holes[i - inspectingTileId.row][
        lastCol - inspectingTileId.col
      ].marble === null && (lastBlackTileId === null || inspectingTileId.id != lastBlackTileId) && (lastRedTileId === null || inspectingTileId.id != lastRedTileId)
      
    ) {
      placeableGrid[i][lastCol] = true;
    }
  }

  // search horizontally at lastRow
  for (let i = 0; i < boardWidth; i++) {
    let inspectingTileId = gameTileState.get(board[lastRow][i]);
    if (board[lastRow][i] === EMPTY_BOARDCELL) continue;
    if (inspectingTileId === undefined) {
      throw new Error("invalid inspecting tile id");
    }
    if (
      inspectingTileId.Holes[lastRow! - inspectingTileId.row][
        i - inspectingTileId.col
      ].marble === null && (lastBlackTileId === null || inspectingTileId.id != lastBlackTileId) && (lastRedTileId === null || inspectingTileId.id != lastRedTileId)
    ) {
      placeableGrid[lastRow][i] = true;
    }
  }
  return placeableGrid;
};
