import { EMPTY_BOARDCELL, MAX_BOARD_SIZE } from "../constants/board";
import { getRandomIntInclusive } from "../utility/random";

const EDGE_CHECK = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
const CONNECTABLE_CELL = -2;
const MARKED_CELL = -3;

let isDone = false;
let generatedBoard: number[][] = Array.from({ length: MAX_BOARD_SIZE }, () =>
  Array.from({ length: MAX_BOARD_SIZE }, () => EMPTY_BOARDCELL)
);

const INITIAL_TILE_TYPE_IDS = {
  2: [5, 9, 11, 14],
  3: [1, 2, 8, 12],
  4: [0, 4, 6, 10, 16],
  6: [3, 7, 13, 15],
};
let tileTypeIds: {
  [key: number]: number[];
} = INITIAL_TILE_TYPE_IDS;
let PostProcessTileIdMap = Array.from({ length: 17 }, () => -1);

const resetPostProcessTileIdMap = () => {
  PostProcessTileIdMap = Array.from({ length: 17 }, () => -1);
};

const resetTileTypeIds = () => {
  tileTypeIds = structuredClone(INITIAL_TILE_TYPE_IDS);
};

type TileEntity = [number, number];

export const getRandomIrregularBoard = (): number[][] => {
  isDone = false;
  while (!isDone) {
    generatedBoard = Array.from({ length: MAX_BOARD_SIZE }, () =>
      Array.from({ length: MAX_BOARD_SIZE }, () => EMPTY_BOARDCELL)
    );
    resetTileTypeIds();
    resetPostProcessTileIdMap();
    TryGetRandomizedTileBoard();
  }

  convertNonHoleToEmptyBoardCell();
  postProcessTileId();
  trimPadding();
  return generatedBoard;
};

const convertNonHoleToEmptyBoardCell = () => {
  for (let i = 0; i < MAX_BOARD_SIZE; i++) {
    for (let j = 0; j < MAX_BOARD_SIZE; j++) {
      if (generatedBoard[i][j] == CONNECTABLE_CELL) {
        generatedBoard[i][j] = EMPTY_BOARDCELL;
      }
    }
  }
};

const postProcessTileId = () => {
  for (let i = 0; i < MAX_BOARD_SIZE; i++) {
    for (let j = 0; j < MAX_BOARD_SIZE; j++) {
      if (generatedBoard[i][j] != EMPTY_BOARDCELL) {
        generatedBoard[i][j] = PostProcessTileIdMap[generatedBoard[i][j]];
      }
    }
  }
};

/**
 * shrink the generatedBoard to the smallest size possible
 */
const trimPadding = () => {
  let minR = MAX_BOARD_SIZE;
  let maxR = -1;
  let minC = MAX_BOARD_SIZE;
  let maxC = -1;
  for (let i = 0; i < MAX_BOARD_SIZE; i++) {
    for (let j = 0; j < MAX_BOARD_SIZE; j++) {
      if (generatedBoard[i][j] != EMPTY_BOARDCELL) {
        if (i < minR) minR = i;
        if (i > maxR) maxR = i;
        if (j < minC) minC = j;
        if (j > maxC) maxC = j;
      }
    }
  }

  const newRows = maxR - minR + 1;
  const newCols = maxC - minC + 1;

  let postProcessedGeneratedBoard = Array.from({ length: newRows }, () =>
    Array.from({ length: newCols }, () => EMPTY_BOARDCELL)
  );

  for (let i = minR; i <= maxR; i++) {
    for (let j = minC; j <= maxC; j++) {
      postProcessedGeneratedBoard[i - minR][j - minC] = generatedBoard[i][j];
    }
  }

  generatedBoard = postProcessedGeneratedBoard;
};

const TryGetRandomizedTileBoard = (): number[][] => {
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

    // suppose we pick a 1x3 piece as the first piece,
    // and written it in the generatedBoard as 0
    // but we want to keep a consistent tileTypeId mapper
    // so we'll have to post process that id to one of the
    // 1x3 piece in `tileTypeIds[3]` (indexed by unique area) which are [1,2,8,12].
    // Then We'll map 0 to 1 in the postprocessing and remove
    // 1 from the array resulting in tileTypeIds[3]: [2,8,12].
    let tileTypeByArea = tilesPool[idx][0] * tilesPool[idx][1];
    let availableTileId = tileTypeIds[tileTypeByArea].shift();
    if (availableTileId === undefined) {
      throw new Error("error randomizing tile: unavailable tile id");
    }
    PostProcessTileIdMap[i] = availableTileId;

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
            EMPTY_BOARDCELL
        ) {
          generatedBoard[i + EDGE_CHECK[k][0]][j + EDGE_CHECK[k][1]] =
            CONNECTABLE_CELL;
        }
      }
    }
  }

  AddTiles(1, tilesPool, structuredClone(generatedBoard));
  return generatedBoard;
};

const AddTiles = (
  curTileId: number,
  tilesPool: TileEntity[],
  generatedBoardState: number[][]
) => {
  if (isDone) {
    return;
  }
  if (curTileId == 17) {
    isDone = true;
    for (let i = 0; i < MAX_BOARD_SIZE; i++) {
      for (let j = 0; j < MAX_BOARD_SIZE; j++) {
        generatedBoard[i][j] = generatedBoardState[i][j];
      }
    }
    return;
  }

  let tile = tilesPool.shift();
  if (tile == undefined) {
    return;
  }
  let tileRows = tile![0];
  let tileCols = tile![1];
  let overlapConnectableCount = 0;
  let isOk = true;
  let validChoices: { connection: number; rowcol: [number, number] }[] = [];
  for (let i = 0; i < MAX_BOARD_SIZE - tileRows + 1; i++) {
    for (let j = 0; j < MAX_BOARD_SIZE - tileCols + 1; j++) {
      overlapConnectableCount = 0;
      isOk = true;
      for (let ti = 0; ti < tileRows; ti++) {
        for (let tj = 0; tj < tileCols; tj++) {
          if (generatedBoardState[i + ti][j + tj] === CONNECTABLE_CELL) {
            overlapConnectableCount++;
          } else if (generatedBoardState[i + ti][j + tj] !== EMPTY_BOARDCELL) {
            isOk = false;
            break;
          }
        }
      }
      if (isOk && overlapConnectableCount > 0) {
        validChoices.push({
          connection: overlapConnectableCount,
          rowcol: [i, j],
        });
      }
    }
  }

  if (validChoices.length == 0) {
    return;
  }

  if (curTileId <= 13) {
    validChoices.sort((a, b) => b.connection - a.connection);
  } else {
    validChoices.sort((a, b) => a.connection - b.connection);
  }

  let prevBoardState = structuredClone(generatedBoardState);

  while (validChoices.length) {
    let randomIdx = 0;

    let randomTileRow = validChoices[randomIdx].rowcol[0];
    let randomTileCol = validChoices[randomIdx].rowcol[1];
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
              EMPTY_BOARDCELL
          ) {
            generatedBoardState[i + EDGE_CHECK[k][0]][j + EDGE_CHECK[k][1]] =
              CONNECTABLE_CELL;
          }
        }
      }
    }

    if (!HasClosedLoop(structuredClone(generatedBoardState))) {
      AddTiles(curTileId + 1, tilesPool, structuredClone(generatedBoardState));
    } else {
      generatedBoardState = prevBoardState;
      continue;
    }
  }

  return;
};

const HasClosedLoop = (board: number[][]): boolean => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (
        board[i][j] === CONNECTABLE_CELL &&
        !CanReachEdge(i, j, structuredClone(board))
      ) {
        return true;
      }
    }
  }
  return false;
};

const isBounded = (row: number, col: number): boolean => {
  return row >= 0 && col >= 0 && row < MAX_BOARD_SIZE && col < MAX_BOARD_SIZE;
};

const isAtRim = (row: number, col: number): boolean => {
  return (
    row == 0 ||
    col == 0 ||
    row == MAX_BOARD_SIZE - 1 ||
    col == MAX_BOARD_SIZE - 1
  );
};

const CanReachEdge = (row: number, col: number, board: number[][]) => {
  if (
    (board[row][col] == CONNECTABLE_CELL ||
      board[row][col] == EMPTY_BOARDCELL) &&
    isAtRim(row, col)
  ) {
    return true;
  }

  let pool: [number, number][] = [];
  for (let i = 0; i < EDGE_CHECK.length; i++) {
    let r = row + EDGE_CHECK[i][0];
    let c = col + EDGE_CHECK[i][1];
    if (
      isBounded(r, c) &&
      (board[r][c] === EMPTY_BOARDCELL || board[r][c] === CONNECTABLE_CELL)
    ) {
      pool.push([r, c]);
    }
  }

  board[row][col] = MARKED_CELL;

  while (pool.length) {
    let cell = pool.shift();
    if (cell == undefined) {
      break;
    }
    let r = cell[0];
    let c = cell[1];
    if (isAtRim(r, c)) {
      if (board[r][c] === EMPTY_BOARDCELL || board[r][c] === CONNECTABLE_CELL)
        return true;
    } else {
      for (let i = 0; i < EDGE_CHECK.length; i++) {
        let nr = r + EDGE_CHECK[i][0];
        let nc = c + EDGE_CHECK[i][1];
        if (
          board[nr][nc] === EMPTY_BOARDCELL ||
          board[nr][nc] === CONNECTABLE_CELL
        ) {
          if (
            isAtRim(nr, nc) &&
            (board[nr][nc] === EMPTY_BOARDCELL ||
              board[nr][nc] === CONNECTABLE_CELL)
          ) {
            return true;
          }
          pool.push([nr, nc]);
        }
      }
      board[r][c] = MARKED_CELL;
    }
  }
  return false;
};
