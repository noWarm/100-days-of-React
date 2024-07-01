import {
  GeneratedBoardCell,
  ConnectableCell,
  MAX_BOARD_SIZE,
  EDGE_CHECK,
  EmptyCell,
} from "../logic/randomizer";

export const printBoard = (board: GeneratedBoardCell[][]): void => {
  let boardString = "";
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      boardString += String(board[i][j]).padStart(2, "0") + " ";
    }
    boardString += "\n";
  }
  console.log(boardString);
};

export const hasClosedLoop = (board: GeneratedBoardCell[][]): boolean => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] === ConnectableCell && !canReachEdge(i, j, board))
        return false;
    }
  }
  return true;
};

// given i,j,board
// check if the i,j has at least one path to reach the rim
// if yes, return true, if no return false

const MarkedCell = "MM";
const canReachEdge = (
  row: number,
  col: number,
  board: (GeneratedBoardCell | typeof MarkedCell)[][]
) => {
  let pool: [number, number][] = [];
  for (let i = 0; i < EDGE_CHECK.length; i++) {
    let r = row + EDGE_CHECK[i][0];
    let c = col + EDGE_CHECK[i][1];
    if (board[r][c] === EmptyCell || board[r][c] === ConnectableCell) {
      pool.push([r, c]);
    }
  }
  board[row][col] = MarkedCell;
  while (pool.length) {
    let cell = pool.shift();
    if (cell == undefined) {
      break;
    }
    let r = cell[0];
    let c = cell[1];
    board[r][c] = MarkedCell;
    if (
      r == 0 ||
      c == 0 ||
      r == MAX_BOARD_SIZE - 1 ||
      c == MAX_BOARD_SIZE - 1
    ) {
      if (board[r][c] === EmptyCell || board[r][c] === ConnectableCell)
        return true;
    } else {
      for (let i = 0; i < EDGE_CHECK.length; i++) {
        let nr = r + EDGE_CHECK[i][0];
        let nc = c + EDGE_CHECK[i][1];
        if (
          (board[nr][nc] === EmptyCell || board[nr][nc] === ConnectableCell) &&
          board[nr][nc] !== MarkedCell
        ) {
          if (
            (nr == 0 ||
              nc == 0 ||
              nr == MAX_BOARD_SIZE - 1 ||
              nc == MAX_BOARD_SIZE - 1) &&
            (board[r][c] === EmptyCell || board[r][c] === ConnectableCell)
          ) {
            return true;
          }
          pool.push([r, c]);
        }
      }
    }
  }
  return false;
};

/*

10 10 07 07 07 05 05 .. xx xx 
13 13 08 08 .. 05 05 .. xx xx 
13 13 08 08 04 04 04 .. xx xx 
13 13 .. 14 03 03 03 .. xx xx 
11 11 .. 14 03 03 03 .. xx xx 
11 11 .. 14 06 06 01 01 .. xx 
11 11 09 09 06 06 01 01 00 .. 
12 12 09 09 .. .. 01 01 00 .. 
12 12 .. .. xx xx .. 02 02 02 
.. .. xx xx xx xx xx .. .. .. 

*/
