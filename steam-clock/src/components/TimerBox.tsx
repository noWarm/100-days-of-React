import Timer from "./Timer.tsx";
import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../constants/itemtypes.ts";

function TimerBox({ id, left, top }) {
  const [{ isDragging }, preview, drag] = useDrag(
    () => ({
      type: ItemTypes.Timer,
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, left, top]
  );

  if (isDragging) {
    return <div ref={preview} />;
  }

  return (
    <div
      className="absolute border-2 border-red-500 w-min h-min bg-[#1B1F27]"
      style={{ left, top }}
    >
      <div ref={drag} className="h-8 border-2 border-green-500"></div>
      <div>
        <Timer></Timer>
      </div>
    </div>
  );
}

export default TimerBox;
