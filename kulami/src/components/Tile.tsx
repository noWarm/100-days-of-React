import { CSSProperties, FC } from "react";
import { GAP_SIZE_PX, PLAYER, TILE_LENGTH_PX } from "../constants/render";
import { Hole } from "./Hole";
import { isHolePlaceable } from "../logic/validMove";
import { PlaceableHolesAtom } from "../App";
import { useAtomValue } from "jotai";

export interface Hole {
  marble: PLAYER | null;
}

export interface TileProps {
  id: number;
  row: number;
  col: number;
  rowHoles: number;
  colHoles: number;
  Holes: Hole[][];
}

export const Tile: FC<TileProps> = ({ id, row, col, rowHoles, colHoles }) => {
  const placeableHoles = useAtomValue(PlaceableHolesAtom);
  const style: CSSProperties = {
    position: "absolute",
    display: "grid",
    gridTemplateColumns: `repeat(${colHoles}, 1fr)`,
    gridGap: `${GAP_SIZE_PX}px`,
    top: `${row * TILE_LENGTH_PX + row * GAP_SIZE_PX}px`,
    left: `${col * TILE_LENGTH_PX + (col - 1) * GAP_SIZE_PX}px`,
  };

  const renderHoles = () => {
    const holes = [];
    for (let i = 0; i < rowHoles; i++) {
      for (let j = 0; j < colHoles; j++) {
        console.log(
          "i,j,isHolePlaceable",
          row+i,
          col+j,
          isHolePlaceable(row, col, placeableHoles)
        );
        holes.push(
          <Hole
            key={`${i}-${j}`}
            col={col + j}
            row={row + i}
            tileId={id}
            isPlaceable={isHolePlaceable(row + i, col + j, placeableHoles)}
          />
        );
      }
    }
    console.log("--------");
    return holes;
  };

  return (
    <div
      className={` bg-[#F2DBC2]  hover:outline-white hover:outline transition-all duration-75 rounded-sm`}
      style={style}
    >
      {renderHoles()}
    </div>
  );
};
