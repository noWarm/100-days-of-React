import { CSSProperties, FC, memo, useEffect } from "react";
import { getSyntheticLeadingComments, transform } from "typescript";
import { ItemTypes } from "./ItemTypes";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Box } from "./Box";

export interface DraggableBoxProps {
  id: string;
  title: string;
  left: number;
  top: number;
}

function getStyles(
  left: number,
  top: number,
  isDragging: boolean
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

export const DraggableBox: FC<DraggableBoxProps> = memo(function DraggableBox(
  props
) {
  const { id, title, left, top } = props;
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, left, top, title },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top, title]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  });

  return (
    <div
      ref={preview}
      style={getStyles(left, top, isDragging)}
      role="DraggableBox"
    >
      <div ref={drag} className="h-6 bg-[#1B1F27] border-2 border-[#1B1F27]"></div>
      <Box title={title} />
    </div>
  );
});
