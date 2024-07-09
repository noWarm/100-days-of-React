import { CSSProperties, FC } from "react";
import { GAP_SIZE_PX, TILE_LENGTH_PX } from "../../constants/render";
import { Hole } from "./Hole";
import { useAtomValue } from "jotai";
import { HoleInterface } from "../../types/type";
import { PlaceableHolesAtom } from "../../App";

export interface TileProps {
  id: number;
  row: number;
  col: number;
  rowHoles: number;
  colHoles: number;
  Holes: HoleInterface[][];
}

export const Tile: FC<TileProps> = ({ id, row, col, rowHoles, colHoles }) => {
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
        holes.push(
          <Hole
            key={`${i}-${j}`}
            col={col + j}
            row={row + i}
            tileId={id}
            isPlaceable={placeableHoles[row + i][col + j]}
          />
        );
      }
    }
    // console.log("--------");
    return holes;
  };

  return (
    <div
      className="bg-[#ac9377]  hover:outline-[#7dbdf6] hover:outline transition-all duration-75 rounded-sm"
      style={style}
    >
      {renderHoles()}
    </div>
  );
};
