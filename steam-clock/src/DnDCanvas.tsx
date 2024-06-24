import { XYCoord, useDrop } from "react-dnd";
import React, { useState } from "react";
import Timer from "./components/Timer.tsx";
import { ItemTypes } from "./constants/itemtypes.ts";
import { DragItem } from "./interfaces.ts";

function DnDCanvas() {
  const [timer, setTimer] = useState<{ top: number; left: number }>({
    top: 50,
    left: 50,
  });

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.Timer,
      drop(item: DragItem, monitor) {
        console.log("in dropp");
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        setTimer({ left, top });
        return undefined;
      },
    }),
    []
  );

  return (
    <div ref={drop} className="relative h-screen">
      <Timer key={0} id={0} left={timer.left} top={timer.top}></Timer>
    </div>
  );
}

export default DnDCanvas;
