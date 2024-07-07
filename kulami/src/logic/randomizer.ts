import { MAX_BOARD_SIZE } from "../constants/render";
import { getRandomIntInclusive } from "../utilities/random";

const EMPTY_CELL = -1;
const CONNECTABLE_CELL = -2;
const MARKED_CELL = -3;

export type GeneratedBoardCell = number;
type TileEntity = [number, number];

const EDGE_CHECK = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

let isDone = false;
let generatedBoard: GeneratedBoardCell[][] = Array.from(
  { length: MAX_BOARD_SIZE },
  () => Array.from({ length: MAX_BOARD_SIZE }, () => EMPTY_CELL)
);

export const GetRandomizedTileBoard = (): number[][] => {
  while (!isDone) {
    generatedBoard = Array.from({ length: MAX_BOARD_SIZE }, () =>
      Array.from({ length: MAX_BOARD_SIZE }, () => EMPTY_CELL)
    );
    TryGetRandomizedTileBoard();
  }
  return generatedBoard;
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
            EMPTY_CELL
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

export const AddTiles = (
  curTileId: number,
  tilesPool: TileEntity[],
  generatedBoardState: GeneratedBoardCell[][]
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
          } else if (generatedBoardState[i + ti][j + tj] !== EMPTY_CELL) {
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

  if (curTileId <= 14) {
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
              EMPTY_CELL
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

const HasClosedLoop = (board: GeneratedBoardCell[][]): boolean => {
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

const CanReachEdge = (
  row: number,
  col: number,
  board: GeneratedBoardCell[][]
) => {
  if (
    (board[row][col] == CONNECTABLE_CELL || board[row][col] == EMPTY_CELL) &&
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
      (board[r][c] === EMPTY_CELL || board[r][c] === CONNECTABLE_CELL)
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
      if (board[r][c] === EMPTY_CELL || board[r][c] === CONNECTABLE_CELL)
        return true;
    } else {
      for (let i = 0; i < EDGE_CHECK.length; i++) {
        let nr = r + EDGE_CHECK[i][0];
        let nc = c + EDGE_CHECK[i][1];
        if (board[nr][nc] === EMPTY_CELL || board[nr][nc] === CONNECTABLE_CELL) {
          if (
            isAtRim(nr, nc) &&
            (board[nr][nc] === EMPTY_CELL || board[nr][nc] === CONNECTABLE_CELL)
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
