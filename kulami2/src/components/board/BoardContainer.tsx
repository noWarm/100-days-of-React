import { useAtomValue } from "jotai";
import { CSSProperties, FC } from "react";
import { GameBoardAtom, GameTileStateAtom } from "../../App";
import { printBoard } from "../../logic/Board";
import { GetTilesFromBoard } from "../../logic/render";
import { TileProps } from "../../types/type";
import { GAP_SIZE_PX, TILE_LENGTH_PX } from "../../constants/render";
import { Tile } from "./Tile";

interface BoardContainerProps {}

const renderBoard = (Tiles: Map<number, TileProps>, board: number[][]) => {
  // const Tiles = GetTilesFromBoard(board);

  const boardHeight = board.length;
  const boardWidth = board[0].length;

  const height = boardHeight * TILE_LENGTH_PX + (boardHeight - 1) * GAP_SIZE_PX;
  const width = boardWidth * TILE_LENGTH_PX + (boardWidth - 1) * GAP_SIZE_PX;
  const style: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
  };
  return (
    <div className="relative" style={style}>
      {Array.from(Tiles).map((el) => (
        <Tile {...el[1]} key={el[0]} />
      ))}
    </div>
  );
};

export const BoardContainer: FC<BoardContainerProps> = ({}) => {
  const gameBoard = useAtomValue(GameBoardAtom);
  const gameTileState = useAtomValue(GameTileStateAtom);

  // printBoard(gameBoard);
  // GetTilesFromBoard(gameBoard);

  return (
    <div className="flex flex-col justify-center items-center h-screen top-0 z-0 pl-96">
      {renderBoard(gameTileState, gameBoard)}
    </div>
  );
};
