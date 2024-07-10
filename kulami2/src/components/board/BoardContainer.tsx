import { useAtom, useAtomValue } from "jotai";
import { CSSProperties, FC, useEffect } from "react";
import {
  GameBoardAtom,
  GameBoardStateAtom,
  GameTileStateAtom,
  NextGameBoardAtom,
  PlaceableHolesAtom,
} from "../../App";
import { GetInitGameBoardState, printBoard } from "../../logic/Board";
import { GetTilesFromBoard } from "../../logic/render";
import { Orientation, TileProps } from "../../types/type";
import {
  GAP_SIZE_PX,
  HOLE_PADDING_SIZE_PX,
  HOLE_SIZE_PX,
  TILE_LENGTH_PX,
} from "../../constants/render";
import { Tile } from "./Tile";
import { animated, useSprings, easings } from "@react-spring/web";
import { getAllHolePlaceable } from "../../logic/validMove";

interface BoardContainerProps {}

export const BoardContainer: FC<BoardContainerProps> = ({}) => {
  const [gameBoard, setGameBoard] = useAtom(GameBoardAtom);
  const [nextGameBoard, setNextGameBoard] = useAtom(NextGameBoardAtom);
  const [gameTileState, setGameTileState] = useAtom(GameTileStateAtom);
  const [placeableHoles, setIsPlaceableHoles] = useAtom(PlaceableHolesAtom);
  const [gameBoardState, setGameBoardState] = useAtom(GameBoardStateAtom);

  const [springs, api] = useSprings(17, (id: number) => {
    let tile = gameTileState.get(id);
    if (tile === undefined) {
      throw new Error(`undefined tile at id ${id}`);
    }

    let row = tile.row;
    let col = tile.col;

    let topPx = row * TILE_LENGTH_PX + row * GAP_SIZE_PX;
    let leftPx = col * TILE_LENGTH_PX + col * GAP_SIZE_PX;
    if (tile.orientation === Orientation.Tall) {
      leftPx += (HOLE_SIZE_PX + HOLE_PADDING_SIZE_PX * 2 ) * tile.rowHoles + GAP_SIZE_PX * (tile.rowHoles-1);
    }

    // console.log(`id-${id} row-${row} col-${col} orie-${tile.orientation}`);

    let left = `${leftPx}px`;
    let top = `${topPx}px`;

    return {
      from: {
        y: top,
        x: left,
        rotate: tile.orientation === Orientation.Tall ? 90 : 0,
      },
      config: {
        mass: 100,
        friction: 800,
        tension: 1200,
        easing: easings.easeInCubic,
      },
    };
  });

  // top: `${row * TILE_LENGTH_PX + row * GAP_SIZE_PX}px`,
  // left: `${col * TILE_LENGTH_PX + col * GAP_SIZE_PX}px`,

  useEffect(() => {
    if (nextGameBoard !== null) {
      api.start((id: number) => {
        let tile = GetTilesFromBoard(nextGameBoard).get(id);
        if (tile === undefined) {
          throw new Error(`undefined tile at id ${id}`);
        }

        let row = tile.row;
        let col = tile.col;

        let topPx = row * TILE_LENGTH_PX + row * GAP_SIZE_PX;
        let leftPx = col * TILE_LENGTH_PX + col * GAP_SIZE_PX;
        if (tile.orientation === Orientation.Tall) {
          leftPx += (HOLE_SIZE_PX + HOLE_PADDING_SIZE_PX * 2 ) * tile.rowHoles + GAP_SIZE_PX * (tile.rowHoles-1);
        }


        let left = `${leftPx}px`;
        let top = `${topPx}px`;
        return {
          to: {
            y: top,
            x: left,
            rotate: tile.orientation === Orientation.Tall ? 90 : 0,
          },
        };
      });

      setGameBoard(nextGameBoard);
      setGameTileState(GetTilesFromBoard(nextGameBoard));
      setIsPlaceableHoles(getAllHolePlaceable(nextGameBoard));
      setGameBoardState(GetInitGameBoardState(nextGameBoard));
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
          <animated.div
            className="absolute origin-top-left"
            style={springs[el[0]]}
            key={el[0]}
          >
            <Tile {...el[1]} />
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
