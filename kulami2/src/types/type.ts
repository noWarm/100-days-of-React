export interface TileProps {
  id: number;
  row: number;
  col: number;
  rowHoles: number;
  colHoles: number;
  Holes: Hole[][];
}

export interface Hole {
  marble: PLAYER | null;
}

export enum PLAYER {
  RED,
  BLACK,
}
