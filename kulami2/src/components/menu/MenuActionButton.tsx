import { useAtomValue } from "jotai";
import { FC } from "react";
import { GameBoardAtom } from "../../App";
import { printBoard } from "../../logic/Board";
import { useGesture, useHover } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/web";

interface MenuActionButtonProps {
  text: string;
  onclickHandler: () => void;
}

export const MenuActionButton: FC<MenuActionButtonProps> = ({
  text,
  onclickHandler,
}) => {
  const gameBoard = useAtomValue(GameBoardAtom);

  const [springs, api] = useSpring(() => ({
    from: {
      width: "367.5px",
      backgroundColor: "black",
      color: "white",
    },
  }));

  const bind = useGesture({
    onHover: ({ hovering }) => {
      if (hovering) {
        api.start(() => ({
          to: { backgroundColor: "red", width: "425px", color: "white" },
        }));
      } else {
        api.start(() => ({
          to: { backgroundColor: "black", width: "367.5px", color: "white" },
        }));
      }
    },
    onPointerDown: () => {
      api.start(() => ({
        to: { backgroundColor: "#c90202", width: "425px", color: "#dbd9d9" },
      }));
    },
    onPointerUp: () => {
      api.start(() => ({
        to: { backgroundColor: "red", width: "425px", color: "white" },
      }));
    },

    onClick: () => {
      onclickHandler();
    },
  });

  printBoard(gameBoard);

  return (
    <animated.div
      className="relative px-8 py-2 my-1 text-white text-2xl font-mono select-none"
      style={{ ...springs }}
      {...bind()}
    >
      <div className="">{text}</div>
    </animated.div>
  );
};
