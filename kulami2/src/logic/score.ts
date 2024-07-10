import { INITIAL_TILE_TYPE_IDS } from "../constants/board";
import { GameCellState, PLAYER } from "../types/type";

export const GetInitialScore = (): { [key in PLAYER]: number } => {
  return {
    [PLAYER.RED]: 0,
    [PLAYER.BLACK]: 0,
  };
};

export const GetScoreFromBoardState = (
  board: number[][],
  boardgamestate: GameCellState[][]
): { [key in PLAYER]: number } => {
  let red = 0;
  let black = 0;

  let marbleById = Array.from({ length: 17 }, () => 0);
  let scoreByTileId = Array.from({ length: 17 }, () => 0);
  for (const [key, values] of Object.entries(INITIAL_TILE_TYPE_IDS)) {
    values.forEach((id) => {
      scoreByTileId[id] = Number(key);
    });
  }

  for (let i = 0; i < boardgamestate.length; i++) {
    for (let j = 0; j < boardgamestate[0].length; j++) {
      if (boardgamestate[i][j].isEmpty) continue;
      switch (boardgamestate[i][j].marble) {
        case PLAYER.BLACK:
          marbleById[board[i][j]] -= 1;
          break;
        case PLAYER.RED:
          marbleById[board[i][j]] += 1;
          break;
        default:
          break;
      }
    }
  }

  for (let i=0;i<17;i++) {
    if (marbleById[i] > 0) {
      red += scoreByTileId[i];
    } else if (marbleById[i] < 0) {
      black += scoreByTileId[i];
    }
  }

  return {
    [PLAYER.RED]: red,
    [PLAYER.BLACK]: black,
  };
};
