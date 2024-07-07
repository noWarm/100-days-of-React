import { useAtomValue } from "jotai";
import { FC } from "react";
import { GameBoardAtom } from "../../App";
import { printBoard } from "../../logic/Board";

interface BoardContainerProps {

}

export const BoardContainer: FC<BoardContainerProps> = ({  }) => {
  const gameBoard = useAtomValue(GameBoardAtom);
  
 printBoard(gameBoard);

  return <div className="flex flex-col justify-center items-center h-screen top-0 z-0 bg-blue-500">TODO</div>;
};
