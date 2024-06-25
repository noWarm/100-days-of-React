import { CSSProperties, FC, useEffect } from "react";
import { TimerBox } from "../Timer/TimerBox";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { ItemTypes } from "../../types/ItemTypes";
import { getEmptyImage } from "react-dnd-html5-backend";

export interface DraggableBoxProps {
  left: number;
  top: number;
}

function getStyles(
    left: number,
    top: number,
    isDragging: boolean,
): CSSProperties {
    const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: "absolute",
    transform,
    WebkitTransform: transform,
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : "",
  };
}

export const DraggableBox: FC<DraggableBoxProps> = ({left, top}) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { left, top },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [left, top]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  });

  return (
    <div ref={preview} style={getStyles(left, top, isDragging)} >
      <div
        ref={drag}
        className="h-6 bg-[#1B1F27] border-2 border-[#1B1F27]"
      ></div>
      <TimerBox />
    </div>
  );
};
