import { GameTileState, HoleMapTileId, LastMarbleMoves } from "../App";
import { BOARD_SIZE, PLAYER } from "../constants/render";

export const getAllHoles = () => {
  let placeableHoles = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      placeableHoles.push([i, j]);
    }
  }
  return placeableHoles;
};

export const getPlaceableHoles = (
  lastMarbleMove: LastMarbleMoves
): number[][] => {
  let placeableHoles = [];
  let lastPlayerMove = lastMarbleMove.lastPlayer;
  if (lastPlayerMove == null) {
    return getAllHoles();
  }

  let lastRow: number | undefined;
  let lastCol: number | undefined;
  let lastTileId: number | undefined;
  if (lastPlayerMove == PLAYER.BLACK) {
    if (lastMarbleMove.blackLast === null) {
      throw new Error("invalid blacklast");
    } else {
      lastRow = lastMarbleMove.blackLast.row;
      lastCol = lastMarbleMove.blackLast.col;
      lastTileId = lastMarbleMove.blackLast.tileId;
    }
  } else {
    if (lastMarbleMove.redLast === null) {
      throw new Error("invalid redlast");
    }
    lastRow = lastMarbleMove.redLast.row;
    lastCol = lastMarbleMove.redLast.col;
    lastTileId = lastMarbleMove.redLast.tileId;
  }

  for (let i = 0; i < BOARD_SIZE; i++) {
    let inspectingTile = GameTileState.get(HoleMapTileId[i][lastCol!]);
    if (
      inspectingTile?.Holes[i - inspectingTile.row][
        lastCol! - inspectingTile.col
      ].marble === null &&
      inspectingTile?.id != lastTileId
    ) {
      placeableHoles.push([i, lastCol!]);
    }
  }
  for (let i = 0; i < BOARD_SIZE; i++) {
    let inspectingTile = GameTileState.get(HoleMapTileId[lastRow!][i]);

    if (
      inspectingTile?.Holes[lastRow! - inspectingTile.row][
        i - inspectingTile.col
      ].marble === null &&
      inspectingTile?.id != lastTileId
    ) {
      placeableHoles.push([lastRow!, i]);
    }
  }
  console.log("placeableHoles", placeableHoles);
  return placeableHoles;
};

export const isHolePlaceable = (
  row: number,
  col: number,
  placeableHoles: number[][]
): boolean => {
  return placeableHoles.some((hole) => hole[0] === row && hole[1] === col);
};
