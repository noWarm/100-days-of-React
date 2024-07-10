import { FC, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  CurrentPlayerAtom,
  GameBoardAtom,
  GameBoardStateAtom,
  GameScoreAtom,
  GameTileStateAtom,
  IsGameStartAtom,
  LastMarbleMovesAtom,
  PlaceableHolesAtom,
} from "../../App";
import {
  getDefault8x8Board,
  getDefaultIrregularBoard,
  GetInitGameBoardState,
  printBoard,
} from "../../logic/Board";
import { getRandomIrregularBoard } from "../../logic/randomBoard";
import { useSpring, animated, useTrail } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { GetTilesFromBoard } from "../../logic/render";
import { getAllHolePlaceable, getPlaceableHoles } from "../../logic/validMove";
import { PLAYER } from "../../types/type";
import { GetInitialScore } from "../../logic/score";

interface InGameMenuActionButtonProps {
  text: string;
  onclickHandler: () => void;
}

const InGameMenuActionButton: FC<InGameMenuActionButtonProps> = ({
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

export const InGameMenuPanel: FC = () => {
  const [gameBoard, setGameBoard] = useAtom(GameBoardAtom);
  const [gameTileState, setGameTileState] = useAtom(GameTileStateAtom);
  const [isGameStart, setIsGameStart] = useAtom(IsGameStartAtom);
  const [placeableHoles, setIsPlaceableHoles] = useAtom(PlaceableHolesAtom);
  const [lastMarbleMove, setLastMarbleMoves] = useAtom(LastMarbleMovesAtom);
  const [currentPlayer, setCurrentPlayer] = useAtom(CurrentPlayerAtom);
  const [gameBoardState, setGameBoardState] = useAtom(GameBoardStateAtom);
  const [gameScore, setGameScore] = useAtom(GameScoreAtom);

  const [trails, api] = useTrail(
    2,
    () => ({
      from: { left: "-100%" },
    }),
    []
  );

  const animateTiles = () => {

  }


  useEffect(() => {
    if (isGameStart) {
      api.start(() => ({
        to: {
          left: "0",
        },
      }));
    }    
    return () => {
      api.start(() => ({
        to: {
          left: "-100%",
        },
      }));
    }
  }, []);

  const InGameMenuTextFnMap = [
    {
      text: "Restart",
      onclickHandler: () => {
        setGameTileState(GetTilesFromBoard(gameBoard));
        setIsPlaceableHoles(getAllHolePlaceable(gameBoard));
        setGameBoardState(GetInitGameBoardState(gameBoard));
        setLastMarbleMoves({
          redLast: null,
          blackLast: null,
          lastPlayer: null,
        });
        setCurrentPlayer(PLAYER.RED);
        setGameScore(GetInitialScore());
      },
      top: 0,
    },
    {
      text: "Quit",
      onclickHandler: () => {
        setIsGameStart(false);
        setGameTileState(GetTilesFromBoard(gameBoard));
        setGameBoardState(GetInitGameBoardState(gameBoard));
        setIsPlaceableHoles(getAllHolePlaceable(gameBoard));
        setLastMarbleMoves({
          redLast: null,
          blackLast: null,
          lastPlayer: null,
        });
        setCurrentPlayer(PLAYER.RED);
        setGameScore(GetInitialScore());
      },
      top: 0,
    },
  ];

  return (
    <div className="absolute flex flex-col my-52 z-5">
      {trails.map((props, id) => (
        <animated.div
          className="relative"
          style={{ ...props, top: `${InGameMenuTextFnMap[id].top}px` }}
          key={id}
        >
          <InGameMenuActionButton
            text={InGameMenuTextFnMap[id].text}
            onclickHandler={InGameMenuTextFnMap[id].onclickHandler}
          />
        </animated.div>
      ))}
    </div>
  );
};
