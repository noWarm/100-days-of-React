import { useEffect, useState } from 'react'
import './App.css'
import { BoardContainer } from './components/board/BoardContainer'
import { atom, useAtom } from 'jotai';
import { getDefault8x8Board, getDefaultIrregularBoard } from './logic/Board';
import { getRandomIrregularBoard } from './logic/randomBoard';

export const GameBoardAtom = atom(getDefault8x8Board());
function App() {
  const [gameBoard, setGameBoard] = useAtom(GameBoardAtom);

  return (
    <>
      <button className='border bg-blue-500' onClick={() => {
        setGameBoard(getDefault8x8Board())
        }}>
        Default Board
      </button>
      <button className='border bg-blue-500' onClick={() => {
        setGameBoard(getDefaultIrregularBoard())
        }}>
        Default Irregular Board
      </button>
      <button className='border bg-blue-500' onClick={() => {
        setGameBoard(getRandomIrregularBoard())
        }}>
        Random Irregular Board
      </button>
      <div className='border border-red-500'>
        <BoardContainer />
      </div>
    </>
  )
}

export default App
