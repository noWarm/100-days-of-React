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

export enum PLAYER {
    RED,
    BLACK
}