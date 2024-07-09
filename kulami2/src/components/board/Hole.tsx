import { CSSProperties, FC, useEffect, useState } from "react";
import { HOLE_PADDING_SIZE_PX, HOLE_SIZE_PX } from "../../constants/render";
import { useAtom, useAtomValue } from "jotai";
import {
  CurrentPlayerAtom,
  GameBoardAtom,
  GameTileStateAtom,
  IsGameEndAtom,
  IsGameStartAtom,
  LastMarbleMovesAtom,
  PlaceableHolesAtom,
  // PlaceableHolesAtom,
} from "../../App";
import { LastMarbleMoves, PLAYER } from "../../types/type";
import { getPlaceableHoles } from "../../logic/validMove";

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
  const [gameTileState, setGameTileState] = useAtom(GameTileStateAtom);
  const [placeableHoles, setPlaceableHoles] = useAtom(PlaceableHolesAtom);
  const gameBoard = useAtomValue(GameBoardAtom);
  const isGameStart = useAtomValue(IsGameStartAtom);
  const isGameEnd = useAtomValue(IsGameEndAtom);

  let newGameTileState = new Map(gameTileState);
  let mappedTile = newGameTileState.get(tileId);
  if (mappedTile === undefined) {
    throw new Error(`tile is undefined at hole ${row}-${col}`);
  }
  let holeState = mappedTile.Holes[row - mappedTile.row][col - mappedTile.col];
  let marble = holeState.marble;
  
  const onClickHandler = () => {
    if (!isGameStart || isGameEnd || !isPlaceable) return;
    if (marble !== null) {
      throw new Error(`invalid hole, marble must be null at ${row} ${col}`);
    }

    let lastMarbleMove: LastMarbleMoves;
    if (currentPlayer == PLAYER.RED) {
      lastMarbleMove = {
        blackLast: lastMarbleMoves.blackLast,
        redLast: { col, row, tileId },
        lastPlayer: currentPlayer,
      };
    } else {
      lastMarbleMove = {
        redLast: lastMarbleMoves.redLast,
        blackLast: { col, row, tileId },
        lastPlayer: currentPlayer,
      };
    }

    mappedTile.Holes[row - mappedTile.row][col - mappedTile.col].marble =
      currentPlayer;

    setGameTileState(newGameTileState);
    setLastMarbleMoves(lastMarbleMove);
    setCurrentPlayer(getNextPlayer(currentPlayer));
    setPlaceableHoles(
      getPlaceableHoles(gameBoard, newGameTileState, lastMarbleMove)
    );
  };

  const holeWrapperStyle: CSSProperties = {
    padding: `${HOLE_PADDING_SIZE_PX}px`,
  };

  const getHoleStyle = (): CSSProperties => {
    let bgColor;
    if (lastMarbleMoves.lastPlayer == null) {
      bgColor = "#3c2d1e";
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

    return {
      width: `${HOLE_SIZE_PX}px`,
      height: `${HOLE_SIZE_PX}px`,
      backgroundColor: bgColor,
    };
  };

  return (
    <div className="" style={holeWrapperStyle}>
      <div
        className="rounded-full bg-[#3c2d1e] hover:bg-[#a08f7d] transition-all duration-75"
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
