import { CSSProperties, FC, useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import update from 'immutability-helper'
import { ItemTypes } from './ItemTypes'
import type { DragItem } from './interfaces'
import { snapToGrid as doSnapToGrid } from './snapToGrid'
import { DraggableBox } from "./DraggableBox";

export interface ContainerProps {

}

interface BoxMap {
  [key: string]: { top: number; left: number; title: string };
}

export const Container: FC<ContainerProps> = ({  }) => {
  const [boxes, setBoxes] = useState<BoxMap>({
    a: { top: 150, left: 150, title: "Drag me around" },
  });

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        }),
      )
    },
    [boxes],
  )

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

        moveBox(item.id, left, top);
        return undefined;
      },
    }),
    [moveBox]
  );

  return (
    <div ref={drop} className="relative w-screen h-screen">
      {Object.keys(boxes).map((key) => (
        <DraggableBox
          key={key}
          id={key}
          {...(boxes[key] as { top: number; left: number; title: string })}
        />
      ))}
    </div>
  );
};
