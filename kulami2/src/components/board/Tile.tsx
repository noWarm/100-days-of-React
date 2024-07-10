import { CSSProperties, FC } from "react";
import { GAP_SIZE_PX, TILE_LENGTH_PX } from "../../constants/render";
import { Hole } from "./Hole";
import { useAtomValue } from "jotai";
import { Orientation } from "../../types/type";
import { PlaceableHolesAtom } from "../../App";

export interface TileProps {
  id: number;
  row: number;
  col: number;
  rowHoles: number;
  colHoles: number;
  orientation: Orientation;
}

export const Tile: FC<TileProps> = ({
  id,
  row,
  col,
  rowHoles,
  colHoles,
  orientation,
}) => {
  const placeableHoles = useAtomValue(PlaceableHolesAtom);
  const style: CSSProperties = {
    // position: "absolute",
    display: "grid",
    gridTemplateColumns: `repeat(${colHoles}, 1fr)`,
    gridGap: `${GAP_SIZE_PX}px`,
    // top: `${row * TILE_LENGTH_PX + row * GAP_SIZE_PX}px`,
    // left: `${col * TILE_LENGTH_PX + col * GAP_SIZE_PX}px`,
  };

  const renderHoles = () => {
    const holes = [];
    for (let i = 0; i < rowHoles; i++) {
      for (let j = 0; j < colHoles; j++) {
        // console.log(
        //   "i,j,isHolePlaceable",
        //   row+i,
        //   col+j,
        //   isHolePlaceable(row, col, placeableHoles)
        // );

        let trueRow = orientation === Orientation.Tall ? row + j : row + i;
        let trueCol = orientation === Orientation.Tall ? col + rowHoles - 1 - i : col + j;

        holes.push(
          <Hole
            key={`${i}-${j}`}
            row={trueRow}
            col={trueCol}
            tileId={id}
            tileOrientation={orientation}
            isPlaceable={placeableHoles[trueRow][trueCol]}
          />
        );
      }
    }
    // console.log("--------");
    return holes;
  };

  return (
    <div
      className="bg-[#e9c59a] rounded-sm"
      style={style}
    >
      {renderHoles()}
      {/* <div className="absolute">{id}</div> */}
    </div>
  );
};
