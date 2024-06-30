import { CSSProperties, FC, useEffect, useState } from "react";
import {
  HOLE_PADDING_SIZE_PX,
  HOLE_SIZE_PX,
  PLAYER,
} from "../constants/render";
import { useAtom, useAtomValue } from "jotai";
import {
  BoardDataAtom,
  CurrentPlayerAtom,
  GameTileStateAtom,
  LastMarbleMovesAtom,
  PlaceableHolesAtom,
} from "../App";

const getNextPlayer = (currentPlayer: PLAYER) => {
  if (currentPlayer == PLAYER.RED) return PLAYER.BLACK;
  return PLAYER.RED;
};

export interface HoleProps {
  row: number;
  col: number;
  tileId: number;
  isPlaceable: boolean;
}

export const Hole: FC<HoleProps> = ({ row, col, tileId, isPlaceable }) => {
  const [currentPlayer, setCurrentPlayer] = useAtom(CurrentPlayerAtom);
  const [lastMarbleMoves, setLastMarbleMoves] = useAtom(LastMarbleMovesAtom);
  const [marble, setMarble] = useState<PLAYER | null>(null);
  const [boardData, setBoardData] = useAtom(BoardDataAtom);
  const [gameTileState, setGameTileState] = useAtom(GameTileStateAtom);

  const onClickHandler = () => {
    if (marble === null && isPlaceable) {
      setMarble(currentPlayer);

      if (currentPlayer == PLAYER.RED) {
        setLastMarbleMoves({
          blackLast: lastMarbleMoves.blackLast,
          redLast: { col, row, tileId },
          lastPlayer: currentPlayer,
        });
      } else {
        setLastMarbleMoves({
          redLast: lastMarbleMoves.redLast,
          blackLast: { col, row, tileId },
          lastPlayer: currentPlayer,
        });
      }

      // let newBoardData = Array.from(boardData);
      // newBoardData[row][col].marble = currentPlayer;
      // setBoardData(newBoardData);

      let newGameTileState = new Map(gameTileState);
      let mappedTile = newGameTileState.get(tileId)!;
      mappedTile.Holes[row - mappedTile.row][col - mappedTile.col].marble =
        currentPlayer;
      console.log("gameTileState", newGameTileState);
      setGameTileState(newGameTileState);
      setCurrentPlayer(getNextPlayer(currentPlayer));
    }
  };

  const holeWrapperStyle: CSSProperties = {
    padding: `${HOLE_PADDING_SIZE_PX}px`,
  };

  const getHoleStyle = (): CSSProperties => {
    let bgColor;
    if (lastMarbleMoves.lastPlayer == null) {
      bgColor = "#D7C0AB";
    } else {
      switch (marble) {
        case PLAYER.RED:
          bgColor = `red`;
          break;
        case PLAYER.BLACK:
          bgColor = `black`;
          break;
        default:
          if (isPlaceable) {
            bgColor = "green";
          } else {
            bgColor = "#D7C0AB";
          }
          break;
      }
    }


    // console.log("placeableHoles in Hole.tsx", placeableHoles);

    return {
      width: `${HOLE_SIZE_PX}px`,
      height: `${HOLE_SIZE_PX}px`,
      backgroundColor: bgColor,
    };
  };

  return (
    <div className="relative" style={holeWrapperStyle}>
      <div
        className="rounded-full bg-[#D7C0AB] hover:bg-[#a08f7d] transition-all duration-75"
        style={getHoleStyle()}
        onClick={onClickHandler}
      >
        {((lastMarbleMoves.blackLast?.col == col &&
          lastMarbleMoves.blackLast.row == row) ||
          (lastMarbleMoves.redLast?.col == col &&
            lastMarbleMoves.redLast.row == row)) && (
          <img src="exclaimation_mark.svg" />
        )}
      </div>
    </div>
  );
};
