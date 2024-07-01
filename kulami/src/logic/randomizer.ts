// x x x - - x
// x x - 0 0 -
// x x - 0 0 -
// x x x - - x
// x x x x x x

import { hasClosedLoop, printBoard } from "../utilities/board";

// 1 1 1

// 1
// 1 2 2 2
// 1

function getRandomIntInclusive(max: number) {
  return Math.floor(Math.random() * (max + 1));
}

export const EmptyCell = "xx";
export const ConnectableCell = "..";
export type GeneratedBoardCell =
  | number
  | typeof EmptyCell
  | typeof ConnectableCell;
type TileEntity = [number, number];
export const MAX_BOARD_SIZE = 10;

export const EDGE_CHECK = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

let isDone = false;
let generatedBoard: GeneratedBoardCell[][] = Array.from(
  { length: MAX_BOARD_SIZE },
  () => Array.from({ length: MAX_BOARD_SIZE }, () => EmptyCell)
);

export const GetRandomizedTileBoard = () => {
  const h_3x2 = getRandomIntInclusive(4);
  const h_3x1 = getRandomIntInclusive(4);
  const h_2x1 = getRandomIntInclusive(4);

  const v_3x2 = 4 - h_3x2;
  const v_3x1 = 4 - h_3x1;
  const v_2x1 = 4 - h_2x1;

  let tilesPool: TileEntity[] = [];
  for (let i = 0; i < h_3x2; i++) tilesPool.push([2, 3]);
  for (let i = 0; i < h_3x1; i++) tilesPool.push([1, 3]);
  for (let i = 0; i < h_2x1; i++) tilesPool.push([1, 2]);
  for (let i = 0; i < v_3x2; i++) tilesPool.push([3, 2]);
  for (let i = 0; i < v_3x1; i++) tilesPool.push([3, 1]);
  for (let i = 0; i < v_2x1; i++) tilesPool.push([2, 1]);
  for (let i = 0; i < 5; i++) tilesPool.push([2, 2]);

  let randomizedTilesPool: TileEntity[] = [];
  for (let i = 0; i < 17; i++) {
    let idx = getRandomIntInclusive(tilesPool.length - 1);
    randomizedTilesPool.push(tilesPool[idx]);
    tilesPool.splice(idx, 1);
  }
  tilesPool = randomizedTilesPool;

  let tile = tilesPool.shift();
  let tileRows = tile![0];
  let tileCols = tile![1];
  const pilotRow = getRandomIntInclusive(MAX_BOARD_SIZE - tile![0]);
  const pilotCol = getRandomIntInclusive(MAX_BOARD_SIZE - tile![1]);
  let curTileId = 0;

  for (let i = pilotRow; i < pilotRow + tileRows; i++) {
    for (let j = pilotCol; j < pilotCol + tileCols; j++) {
      generatedBoard[i][j] = curTileId;
    }
  }

  for (let i = pilotRow; i < pilotRow + tileRows; i++) {
    for (let j = pilotCol; j < pilotCol + tileCols; j++) {
      for (let k = 0; k < EDGE_CHECK.length; k++) {
        if (
          i + EDGE_CHECK[k][0] >= 0 &&
          i + EDGE_CHECK[k][0] < MAX_BOARD_SIZE &&
          j + EDGE_CHECK[k][1] >= 0 &&
          j + EDGE_CHECK[k][1] < MAX_BOARD_SIZE &&
          generatedBoard[i + EDGE_CHECK[k][0]][j + EDGE_CHECK[k][1]] ===
            EmptyCell
        ) {
          generatedBoard[i + EDGE_CHECK[k][0]][j + EDGE_CHECK[k][1]] =
            ConnectableCell;
        }
      }
    }
  }

  AddTiles(1, tilesPool, generatedBoard);
  return generatedBoard;
};

export const AddTiles = (
  curTileId: number,
  tilesPool: TileEntity[],
  generatedBoardState: GeneratedBoardCell[][]
) => {
  if (isDone) {
    return;
  }
  console.log("curTileId", curTileId);
  printBoard(generatedBoardState);

  if (curTileId == 17) {
    isDone = true;
    for (let i = 0; i < MAX_BOARD_SIZE; i++) {
      for (let j = 0; j < MAX_BOARD_SIZE; j++) {
        generatedBoard[i][j] = generatedBoardState[i][j];
      }
    }
    return;
  }

  console.log("tilesPool", tilesPool);
  let tile = tilesPool.shift();
  if (tile == undefined) {
    return;
  }
  let tileRows = tile![0];
  let tileCols = tile![1];
  let overlapConnectableCount = 0;
  let isOk = true;
  let validChoices: [number, number][] = [];
  for (let i = 0; i < MAX_BOARD_SIZE - tile![0]; i++) {
    for (let j = 0; j < MAX_BOARD_SIZE - tile![0]; j++) {
      overlapConnectableCount = 0;
      isOk = true;
      for (let ti = 0; ti < tileRows; ti++) {
        for (let tj = 0; tj < tileCols; tj++) {
          if (generatedBoardState[i + ti][j + tj] === ConnectableCell) {
            overlapConnectableCount++;
          } else if (generatedBoardState[i + ti][j + tj] !== EmptyCell) {
            isOk = false;
            break;
          }
        }
      }
      if (isOk && overlapConnectableCount > 0) {
        validChoices.push([i, j]);
      }
    }
  }

  if (validChoices.length == 0) {
    return null;
  }

  while (validChoices.length) {
    let randomIdx = getRandomIntInclusive(validChoices.length - 1);
    console.log("curTileId", curTileId);
    console.log("randomIdx", randomIdx);
    console.log("validChoices", validChoices);

    let randomTileRow = validChoices[randomIdx][0];
    let randomTileCol = validChoices[randomIdx][1];
    validChoices.splice(randomIdx, 1);
    for (let ti = 0; ti < tileRows; ti++) {
      for (let tj = 0; tj < tileCols; tj++) {
        generatedBoardState[randomTileRow + ti][randomTileCol + tj] = curTileId;
      }
    }

    for (let i = randomTileRow; i < randomTileRow + tileRows; i++) {
      for (let j = randomTileCol; j < randomTileCol + tileCols; j++) {
        for (let k = 0; k < EDGE_CHECK.length; k++) {
          if (
            i + EDGE_CHECK[k][0] >= 0 &&
            i + EDGE_CHECK[k][0] < MAX_BOARD_SIZE &&
            j + EDGE_CHECK[k][1] >= 0 &&
            j + EDGE_CHECK[k][1] < MAX_BOARD_SIZE &&
            generatedBoardState[i + EDGE_CHECK[k][0]][j + EDGE_CHECK[k][1]] ===
              EmptyCell
          ) {
            generatedBoardState[i + EDGE_CHECK[k][0]][j + EDGE_CHECK[k][1]] =
              ConnectableCell;
          }
        }
      }
    }

    // if no closed loop
    if (!hasClosedLoop(generatedBoardState)) {
        AddTiles(curTileId + 1, tilesPool, generatedBoardState);
    }
  }

  return null;
};
