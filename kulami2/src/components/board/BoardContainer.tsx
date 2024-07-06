import { useAtomValue } from "jotai";
import { FC } from "react";
import { GameBoardAtom } from "../../App";
import { printBoard } from "../../logic/Board";

interface BoardContainerProps {

}

export const BoardContainer: FC<BoardContainerProps> = ({  }) => {
  const gameBoard = useAtomValue(GameBoardAtom);
  
 printBoard(gameBoard);

  return <div>board container</div>;
};
