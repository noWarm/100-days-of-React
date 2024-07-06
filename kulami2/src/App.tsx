import { useEffect, useState } from "react";
import "./App.css";
import { BoardContainer } from "./components/board/BoardContainer";
import { atom, useAtom } from "jotai";
import { getDefault8x8Board, getDefaultIrregularBoard } from "./logic/Board";
import { getRandomIrregularBoard } from "./logic/randomBoard";
import { MenuActionButton } from "./components/menu/MenuActionButton";

export const GameBoardAtom = atom(getDefault8x8Board());
function App() {
  const [gameBoard, setGameBoard] = useAtom(GameBoardAtom);

  const playGame = () => {
    console.log("play game");
  };

  return (
    <>
      <div className="absolute top-4 left-4">
        <p className="kulami-logo-display-font text-7xl">Kulami</p>
        <p className="flex justify-end font-mono">A game by Andreas Kuhnekath</p>
      </div>
      <div className="flex flex-col absolute my-40">
        <MenuActionButton text={"Play"} onclickHandler={playGame} />
        <div className="mt-2">
          <MenuActionButton
            text={"Default 8x8Board"}
            onclickHandler={() => {
              setGameBoard(getDefault8x8Board());
            }}
          />
          <MenuActionButton
            text={"Default Irregular Board"}
            onclickHandler={() => {
              setGameBoard(getDefaultIrregularBoard());
            }}
          />
          <MenuActionButton
            text={"Random Board"}
            onclickHandler={() => {
              setGameBoard(getRandomIrregularBoard());
            }}
          />
        </div>
      </div>
      <div className="border flex justify-center">
        <BoardContainer />
      </div>
    </>
  );
}

export default App;
