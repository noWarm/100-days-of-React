export interface TileProps {
  id: number;
  row: number;
  col: number;
  rowHoles: number;
  colHoles: number;
  Holes: HoleInterface[][];
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
