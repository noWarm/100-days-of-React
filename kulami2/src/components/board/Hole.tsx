import { CSSProperties, FC, useEffect, useState } from "react";
import { HOLE_PADDING_SIZE_PX, HOLE_SIZE_PX } from "../../constants/render";
import { useAtom, useAtomValue } from "jotai";
import {
  CurrentPlayerAtom,
  GameBoardAtom,
  GameBoardStateAtom,
  GameScoreAtom,
  GameTileStateAtom,
  IsGameEndAtom,
  IsGameStartAtom,
  LastMarbleMovesAtom,
  PlaceableHolesAtom,
  // PlaceableHolesAtom,
} from "../../App";
import { LastMarbleMoves, Orientation, PLAYER } from "../../types/type";
import { getPlaceableHoles } from "../../logic/validMove";
import { printGameBoardState } from "../../logic/Board";
import { GetScoreFromBoardState } from "../../logic/score";

const getNextPlayer = (currentPlayer: PLAYER) => {
  if (currentPlayer == PLAYER.RED) return PLAYER.BLACK;
  return PLAYER.RED;
};

export interface HoleProps {
  row: number;
  col: number;
  tileId: number;
  isPlaceable: boolean;
  tileOrientation: Orientation;
}

export const Hole: FC<HoleProps> = ({
  row,
  col,
  tileId,
  isPlaceable,
  tileOrientation,
}) => {
  const [currentPlayer, setCurrentPlayer] = useAtom(CurrentPlayerAtom);
  const [lastMarbleMoves, setLastMarbleMoves] = useAtom(LastMarbleMovesAtom);
  // const [gameTileState, setGameTileState] = useAtom(GameTileStateAtom);
  const [gameBoardState, setGameBoardState] = useAtom(GameBoardStateAtom);
  const [placeableHoles, setPlaceableHoles] = useAtom(PlaceableHolesAtom);
  const gameBoard = useAtomValue(GameBoardAtom);
  const isGameStart = useAtomValue(IsGameStartAtom);
  const isGameEnd = useAtomValue(IsGameEndAtom);
  const [gameScore, setGameScore] = useAtom(GameScoreAtom);

  const [isHovered, setIsHovered] = useState(false);

  let marble = gameBoardState[row][col].marble;

  GetScoreFromBoardState(gameBoard, gameBoardState);

  const onClickHandler = () => {
    // console.log(`row-${row} col-${col}`);
    
    if (!isGameStart || isGameEnd || !isPlaceable) return;
    if (marble !== null) {
      throw new Error(`invalid hole, marble must be null at ${row} ${col}`);
    }

    gameBoardState[row][col].marble = currentPlayer;

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

    setGameBoardState(gameBoardState);
    setLastMarbleMoves(lastMarbleMove);
    setCurrentPlayer(getNextPlayer(currentPlayer));
    setPlaceableHoles(
      getPlaceableHoles(gameBoard, gameBoardState, lastMarbleMove)
    );
    setGameScore(GetScoreFromBoardState(gameBoard, gameBoardState));
  };

  const holeWrapperStyle: CSSProperties = {
    padding: `${HOLE_PADDING_SIZE_PX}px`,
  };

  const HoleNormalBg = "#d1af88";

  const getHoleStyle = (): CSSProperties => {
    let bgColor;
    if (lastMarbleMoves.lastPlayer == null) {
      bgColor = HoleNormalBg;
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
            if (isHovered) {
              bgColor = "#4a8a0b";
            } else {
              bgColor = "#6ac90c";
            }
          } else {
            bgColor = HoleNormalBg;
          }
          break;
      }
    }

    return {
      width: `${HOLE_SIZE_PX}px`,
      height: `${HOLE_SIZE_PX}px`,
      backgroundColor: bgColor,
      transition: "all 75ms",
    };
  };

  const getImgStyle = (): CSSProperties => {
    return {
      transform:
        tileOrientation === Orientation.Tall
          ? "rotate(-90deg)"
          : "rotate(0deg)",
      userSelect: "none",
    };
  };

  return (
    <div className="bg-[#e9c59a]" style={holeWrapperStyle} onClick={onClickHandler} onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}>
      <div
        className="rounded-full bg-[#c4a481] shadow-inner"
        style={getHoleStyle()}
      >
        {((lastMarbleMoves.blackLast?.col == col &&
          lastMarbleMoves.blackLast.row == row) ||
          (lastMarbleMoves.redLast?.col == col &&
            lastMarbleMoves.redLast.row == row)) && (
          <img src="exclaimation_mark.svg" style={getImgStyle()} />
        )}
      </div>
    </div>
  );
};
