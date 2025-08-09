export interface Position {
  x: number;
  y: number;
}

export interface TetrisPiece {
  shape: number[][];
  color: string;
  position: Position;
  rotation: number;
}

export interface GameState {
  board: string[][];
  currentPiece: TetrisPiece | null;
  nextPiece: TetrisPiece | null;
  score: number;
  level: number;
  lines: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export const BOARD_WIDTH = 15;
export const BOARD_HEIGHT = 30;

export const TETRIS_PIECES = {
  I: {
    shape: [
      [1, 1, 1, 1]
    ],
    color: '#00f5ff'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#ffed00'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: '#a000f0'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: '#00f000'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: '#f00000'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: '#0000f5'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: '#ff8000'
  }
};

export const PIECE_NAMES = Object.keys(TETRIS_PIECES) as Array<keyof typeof TETRIS_PIECES>;