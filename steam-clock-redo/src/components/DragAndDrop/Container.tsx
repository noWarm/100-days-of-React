import { CSSProperties, FC, useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../types/ItemTypes";
import type { DragItem } from "../../types/interfaces";
import { DraggableBox } from "./DraggableBox";

interface BoxMap {
  top: number;
  left: number;
}

export const Container: FC = ({}) => {
  const [boxes, setBoxes] = useState<BoxMap>({
    top: 150,
    left: 150,
  });

  const moveBox = useCallback(
    (left: number, top: number) => {
      setBoxes({ left, top });
    },
    [boxes]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item: DragItem, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as {
          x: number;
          y: number;
        };

        let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);

        moveBox(left, top);
        return undefined;
      },
    }),
    [moveBox]
  );

  return (
    <div ref={drop} className="relative w-screen h-screen">
        <DraggableBox {...boxes}/>
    </div>
  );
};
