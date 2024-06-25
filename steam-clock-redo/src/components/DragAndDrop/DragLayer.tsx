import { CSSProperties, FC } from "react";
import { XYCoord, useDragLayer } from "react-dnd";
import { ItemTypes } from "../../types/ItemTypes";
import { TimerBox } from "../Timer/TimerBox";

const layerStyles: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

function getBoxStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }

  let { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export const DragLayer: FC = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  function renderItem() {
    switch (itemType) {
      case ItemTypes.BOX:
        return (
          <div className="w-min">
            <div className="h-6 bg-[#1B1F27] border-2 border-[#1B1F27]"></div>
            <TimerBox />
          </div>
        );
      default:
        return null;
    }
  }

  if (!isDragging) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div style={getBoxStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
    </div>
  );
};
