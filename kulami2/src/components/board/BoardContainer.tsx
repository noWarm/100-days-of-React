import { useAtom, useAtomValue } from "jotai";
import { CSSProperties, FC, useEffect } from "react";
import { GameBoardAtom, GameTileStateAtom, NextGameBoardAtom, PlaceableHolesAtom } from "../../App";
import { printBoard } from "../../logic/Board";
import { GetTilesFromBoard } from "../../logic/render";
import { TileProps } from "../../types/type";
import { GAP_SIZE_PX, TILE_LENGTH_PX } from "../../constants/render";
import { Tile } from "./Tile";
import { animated, useSprings } from "@react-spring/web";
import { getAllHolePlaceable } from "../../logic/validMove";

interface BoardContainerProps {}

export const BoardContainer: FC<BoardContainerProps> = ({}) => {
  const [gameBoard, setGameBoard] = useAtom(GameBoardAtom);
  const [nextGameBoard, setNextGameBoard] = useAtom(NextGameBoardAtom);
  const [gameTileState, setGameTileState] = useAtom(GameTileStateAtom);
  const [placeableHoles, setIsPlaceableHoles] = useAtom(PlaceableHolesAtom);
  

  const [springs, api] = useSprings(17, (id) => {
    let tile = gameTileState.get(id);
    if (tile === undefined) {
      throw new Error(`undefined tile at id ${id}`);
    }

    let row = tile.row;
    let col = tile.col;

    let top = `${row * TILE_LENGTH_PX + row * GAP_SIZE_PX}px`;
    let left = `${col * TILE_LENGTH_PX + col * GAP_SIZE_PX}px`;
    return {
      from: {
        x: top,
        y: left,
      },
      config: {
        mass: 50,
        friction: 600,
        tension: 1200,
      },
    };
  });

  // top: `${row * TILE_LENGTH_PX + row * GAP_SIZE_PX}px`,
  // left: `${col * TILE_LENGTH_PX + col * GAP_SIZE_PX}px`,

  useEffect(() => {
    if (nextGameBoard !== null) {
      api.start((id) => {
        let tile = GetTilesFromBoard(nextGameBoard).get(id);
        if (tile === undefined) {
          throw new Error(`undefined tile at id ${id}`);
        }

        let row = tile.row;
        let col = tile.col;

        let top = `${row * TILE_LENGTH_PX + row * GAP_SIZE_PX}px`;
        let left = `${col * TILE_LENGTH_PX + col * GAP_SIZE_PX}px`;
        return {
          to: {
            x: top,
            y: left,
          },
        };
      });

      setGameBoard(nextGameBoard);
      setGameTileState(GetTilesFromBoard(nextGameBoard));
      setIsPlaceableHoles(getAllHolePlaceable(nextGameBoard));
      setNextGameBoard(null);
    }
  }, [nextGameBoard]);

  const renderBoard = (Tiles: Map<number, TileProps>, board: number[][]) => {
    const boardHeight = board.length;
    const boardWidth = board[0].length;

    const height =
      boardHeight * TILE_LENGTH_PX + (boardHeight - 1) * GAP_SIZE_PX;
    const width = boardWidth * TILE_LENGTH_PX + (boardWidth - 1) * GAP_SIZE_PX;
    const style: CSSProperties = {
      width: `${width}px`,
      height: `${height}px`,
    };
    return (
      <div className="relative" style={style}>
        {Array.from(Tiles).map((el) => (
          <animated.div className="absolute" style={springs[el[0]]}>
            <Tile {...el[1]} key={el[0]} />
          </animated.div>
        ))}
      </div>
    );
  };

  // printBoard(gameBoard);
  // GetTilesFromBoard(gameBoard);

  return (
    <div className="flex flex-col justify-center items-center h-screen z-0 pl-96">
      {renderBoard(gameTileState, gameBoard)}
    </div>
  );
};
