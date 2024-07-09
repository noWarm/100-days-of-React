export interface TileProps {
  id: number;
  row: number;
  col: number;
  rowHoles: number;
  colHoles: number;
  orientation: Orientation;
  Holes: HoleInterface[][];
}

export enum Orientation {
  Tall, // e.g. 3x1
  Wide // e.g. 1x3
}

export interface HoleInterface {
  marble: PLAYER | null;
}

export enum PLAYER {
  RED,
  BLACK,
}

export interface LastMarble {
  row: number;
  col: number;
  tileId: number;
}

export interface LastMarbleMoves {
  redLast: LastMarble | null;
  blackLast: LastMarble | null;
  lastPlayer: PLAYER | null;
}
