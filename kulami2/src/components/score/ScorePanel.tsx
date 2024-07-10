import { useAtomValue } from "jotai";
import { FC } from "react";
import { GameScoreAtom } from "../../App";

export const ScorePanel: FC = () => {
  const gameScore = useAtomValue(GameScoreAtom);
  return (
    <div className="absolute grid grid-cols-2 gap-8 my-96 px-4 py-4 z-5 text-4xl font-bold border border-black text-center w-[370px]">
      {/* <div>
        isGameEnd: false 
      </div> */}
      <div className="text-red-600">RED:</div>
      <div className="text-red-600">{gameScore[0]}</div>
      <div>BLACK:</div>
      <div>{gameScore[1]}</div>
    </div>
  );
};
