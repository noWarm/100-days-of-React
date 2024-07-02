import { ConnectableCell, EmptyCell, GeneratedBoardCell } from "../logic/randomizer";

export const GAP_SIZE_PX = 4;
export const HOLE_PADDING_SIZE_PX = 8;
export const HOLE_SIZE_PX = 32;
export const TILE_LENGTH_PX = HOLE_PADDING_SIZE_PX * 2 + HOLE_SIZE_PX;
export const BOARD_SIZE = 8;

export const DefaultBoard8x8 = [
    [0, 0, 1, 2, 2, 2, 3, 3],
    [0, 0, 1, 4, 4, 5, 3, 3],
    [6, 6, 1, 4, 4, 5, 3, 3],
    [6, 6, 7, 7, 7, 8, 8, 8],
    [9, 9, 7, 7, 7, 10, 10, 11],
    [12, 13, 13, 14, 14, 10, 10, 11],
    [12, 13, 13, 15, 15, 15, 16, 16],
    [12, 13, 13, 15, 15, 15, 16, 16],
  ];

  let xxxx = EmptyCell as GeneratedBoardCell;
  export let DefaultIrregularBoard  = [
    [xxxx, xxxx, xxxx, xxxx, 0x00, 0x00, xxxx, xxxx, xxxx, xxxx],
    [xxxx, xxxx, 0x01, 0x01, 0x00, 0x00, 0x02, xxxx, xxxx, xxxx],
    [0x03, 0x03, 0x01, 0x01, 0x04, 0x04, 0x02, xxxx, xxxx, xxxx],
    [0x03, 0x03, 0x05, 0x06, 0x06, 0x06, 0x02, 0x07, 0x07, 0x07],
    [0x03, 0x03, 0x05, 0x06, 0x06, 0x06, 0x08, 0x08, 0x08, xxxx],
    [0x09, 0x09, 0x05, 0x10, 0x10, 0x10, 0x08, 0x08, 0x08, xxxx],
    [xxxx, xxxx, 0x11, 0x11, 0x12, 0x13, 0x13, 0x14, 0x14, xxxx],
    [xxxx, xxxx, 0x11, 0x11, 0x12, 0x13, 0x13, 0x14, 0x14, xxxx],
    [xxxx, xxxx, xxxx, 0x15, 0x15, 0x16, 0x16, 0x14, 0x14, xxxx],
    [xxxx, xxxx, xxxx, xxxx, xxxx, 0x16, 0x16, xxxx, xxxx, xxxx],
  ];

export enum PLAYER {
    RED,
    BLACK
}