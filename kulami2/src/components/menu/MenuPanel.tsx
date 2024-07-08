import { FC } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  GameBoardAtom,
  GameTileStateAtom,
  IsGameStartAtom,
  PlaceableHolesAtom,
} from "../../App";
import {
  getDefault8x8Board,
  getDefaultIrregularBoard,
  printBoard,
} from "../../logic/Board";
import { getRandomIrregularBoard } from "../../logic/randomBoard";
import { useSpring, animated, useTrail } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { GetTilesFromBoard } from "../../logic/render";
import { getAllHolePlaceable, getPlaceableHoles } from "../../logic/validMove";

interface MenuActionButtonProps {
  text: string;
  onclickHandler: () => void;
}

const MenuActionButton: FC<MenuActionButtonProps> = ({
  text,
  onclickHandler,
}) => {
  const gameBoard = useAtomValue(GameBoardAtom);
  const extendedLength = "450px";
  const normalWidth = "370px";

  const [springs, api] = useSpring(() => ({
    from: {
      width: normalWidth,
      backgroundColor: "black",
      color: "white",
      left: "-100%",
    },
  }));

  const bind = useGesture({
    onHover: ({ hovering }) => {
      if (hovering) {
        api.start(() => ({
          to: { backgroundColor: "red", width: extendedLength, color: "white" },
        }));
      } else {
        api.start(() => ({
          to: { backgroundColor: "black", width: normalWidth, color: "white" },
        }));
      }
    },
    onPointerDown: () => {
      api.start(() => ({
        to: {
          backgroundColor: "#911313",
          width: extendedLength,
          color: "#e6dfdf",
        },
      }));
    },
    onPointerUp: () => {
      api.start(() => ({
        to: { backgroundColor: "red", width: extendedLength, color: "white" },
      }));
    },

    onClick: () => {
      onclickHandler();
    },
  });

  return (
    <animated.div
      className="px-8 py-3 my-1 text-white text-xl font-mono select-none z-10"
      style={springs}
      {...bind()}
    >
      <div className="">{text}</div>
    </animated.div>
  );
};

export const MenuPanel: FC = () => {
  const [gameBoard, setGameBoard] = useAtom(GameBoardAtom);
  const [gameTileState, setGameTileState] = useAtom(GameTileStateAtom);
  const [isGameStart, setIsGameStart] = useAtom(IsGameStartAtom);
  const [placeableHoles, setIsPlaceableHoles] = useAtom(PlaceableHolesAtom);

  const [trails, api] = useTrail(
    4,
    () => ({
      from: { left: "-100%" },
      to: { left: "0" },
    }),
    []
  );

  const playGame = () => {
    setIsGameStart(true);
  };

  const MenuTextFnMap = [
    {
      text: "Play",
      onclickHandler: playGame,
      top: 0,
    },
    {
      text: "Default 8x8 Board",
      onclickHandler: () => {
        let board = getDefault8x8Board();
        setGameBoard(board);
        setGameTileState(GetTilesFromBoard(board));
        setIsPlaceableHoles(getAllHolePlaceable(board));
      },
      top: 20,
    },
    {
      text: "Default Irregular Board",
      onclickHandler: () => {
        let board = getDefaultIrregularBoard();
        setGameBoard(board);
        setGameTileState(GetTilesFromBoard(board));
        setIsPlaceableHoles(getAllHolePlaceable(board));
      },
      top: 20,
    },
    {
      text: "Random Irregular Board",
      onclickHandler: () => {
        let board = getRandomIrregularBoard();
        setGameBoard(board);
        setGameTileState(GetTilesFromBoard(board));
        setIsPlaceableHoles(getAllHolePlaceable(board));
      },
      top: 20,
    },
  ];

  return (
    <div className="absolute flex flex-col my-52 z-10">
      {trails.map((props, id) => (
        <animated.div
          className="relative"
          style={{ ...props, top: `${MenuTextFnMap[id].top}px` }}
          key={id}
        >
          <MenuActionButton
            text={MenuTextFnMap[id].text}
            onclickHandler={MenuTextFnMap[id].onclickHandler}
          />
        </animated.div>
      ))}
    </div>
  );
};