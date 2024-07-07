import { EMPTY_CELL } from "../constants/render";
import { GeneratedBoardCell } from "../logic/randomizer";

export const printBoard = (board: GeneratedBoardCell[][]): void => {
  let boardString = "";
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] == EMPTY_CELL) {
        boardString += ".." + " ";
      } else {
        boardString += String(board[i][j]).padStart(2, "0") + " ";
      }
    }
    boardString += "\n";
  }
  console.log(boardString);
};
