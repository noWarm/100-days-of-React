import { EMPTY_BOARDCELL } from "../constants/board";
import { GameCellState } from "../types/type";

export const getDefault8x8Board = (): number[][] => {
  return [
    [0, 0, 1, 2, 2, 2, 3, 3],
    [0, 0, 1, 4, 4, 5, 3, 3],
    [6, 6, 1, 4, 4, 5, 3, 3],
    [6, 6, 7, 7, 7, 8, 8, 8],
    [9, 9, 7, 7, 7, 10, 10, 11],
    [12, 13, 13, 14, 14, 10, 10, 11],
    [12, 13, 13, 15, 15, 15, 16, 16],
    [12, 13, 13, 15, 15, 15, 16, 16],
  ];
};

export const getDefaultIrregularBoard = (): number[][] => {
  return [
    [99, 99, 99, 99, 0, 0, 99, 99, 99, 99],
    [99, 99, 4, 4, 0, 0, 2, 99, 99, 99],
    [3, 3, 4, 4, 5, 5, 2, 99, 99, 99],
    [3, 3, 1, 7, 7, 7, 2, 8, 8, 8],
    [3, 3, 1, 7, 7, 7, 13, 13, 13, 99],
    [9, 9, 1, 12, 12, 12, 13, 13, 13, 99],
    [99, 99, 6, 6, 11, 10, 10, 15, 15, 99],
    [99, 99, 6, 6, 11, 10, 10, 15, 15, 99],
    [99, 99, 99, 14, 14, 16, 16, 15, 15, 99],
    [99, 99, 99, 99, 99, 16, 16, 99, 99, 99],
  ];
};

export const printBoard = (board: number[][]) => {
  let boardString = "";
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] == EMPTY_BOARDCELL) {
        boardString += ".." + " ";
      } else {
        boardString += String(board[i][j]).padStart(2, "0") + " ";
      }
    }
    boardString += "\n";
  }
  // console.log(boardString);
};

export const GetInitGameBoardState = (board: number[][]): GameCellState[][] => {
  return board.map((row, rowIndex) =>
    row.map((tileId, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      tileId: tileId,
      marble: null,
      isEmpty: (tileId === EMPTY_BOARDCELL)
    }))
  );
};

export const printGameBoardState = (gameCellState: GameCellState[][]) => {
  let boardStateString = "";
  for (let i = 0; i < gameCellState.length; i++) {
    for (let j = 0; j < gameCellState[0].length; j++) {
      if (gameCellState[i][j].isEmpty) {
        boardStateString += "x" + " ";
      }
      else if (gameCellState[i][j].marble === null) {
        boardStateString += "." + " ";
      } else {
        boardStateString += gameCellState[i][j].marble + " ";
      }
    }
    boardStateString += "\n";
  }
  // console.log(boardStateString);
}
