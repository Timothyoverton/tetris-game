import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { 
  TetrisPiece, 
  GameState, 
  Position, 
  BOARD_WIDTH, 
  BOARD_HEIGHT, 
  TETRIS_PIECES, 
  PIECE_NAMES 
} from '../models/tetris.model';

@Injectable({
  providedIn: 'root'
})
export class TetrisGameService {
  private gameState: GameState;
  private gameSubject = new BehaviorSubject<GameState>({} as GameState);
  public gameState$ = this.gameSubject.asObservable();
  
  private linesClearedSubject = new BehaviorSubject<number[]>([]);
  public linesCleared$ = this.linesClearedSubject.asObservable();
  
  private gameInterval: Subscription | null = null;
  private dropSpeed = 1000;

  constructor() {
    this.initializeGame();
  }

  private initializeGame(): void {
    this.gameState = {
      board: this.createEmptyBoard(),
      currentPiece: null,
      nextPiece: this.generateRandomPiece(),
      score: 0,
      level: 1,
      lines: 0,
      isGameOver: false,
      isPaused: false
    };
    
    this.spawnNewPiece();
    this.gameSubject.next(this.gameState);
  }

  private createEmptyBoard(): string[][] {
    return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''));
  }

  private generateRandomPiece(): TetrisPiece {
    const pieceKey = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
    const piece = TETRIS_PIECES[pieceKey];
    
    return {
      shape: piece.shape,
      color: piece.color,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      rotation: 0
    };
  }

  private spawnNewPiece(): void {
    this.gameState.currentPiece = this.gameState.nextPiece;
    this.gameState.nextPiece = this.generateRandomPiece();
    
    if (this.gameState.currentPiece && this.isCollision(this.gameState.currentPiece)) {
      this.gameState.isGameOver = true;
    }
  }

  private isCollision(piece: TetrisPiece, deltaX = 0, deltaY = 0): boolean {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.position.x + x + deltaX;
          const newY = piece.position.y + y + deltaY;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          
          if (newY >= 0 && this.gameState.board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private lockPiece(): void {
    if (!this.gameState.currentPiece) return;
    
    for (let y = 0; y < this.gameState.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.gameState.currentPiece.shape[y].length; x++) {
        if (this.gameState.currentPiece.shape[y][x]) {
          const boardX = this.gameState.currentPiece.position.x + x;
          const boardY = this.gameState.currentPiece.position.y + y;
          
          if (boardY >= 0) {
            this.gameState.board[boardY][boardX] = this.gameState.currentPiece.color;
          }
        }
      }
    }
    
    this.clearLines();
    this.spawnNewPiece();
  }

  private clearLines(): void {
    let linesCleared = 0;
    let clearedRows: number[] = [];
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (this.gameState.board[y].every(cell => cell !== '')) {
        clearedRows.push(y);
        this.gameState.board.splice(y, 1);
        this.gameState.board.unshift(Array(BOARD_WIDTH).fill(''));
        linesCleared++;
        y++; // Check the same row again
      }
    }
    
    if (linesCleared > 0) {
      // Emit the cleared rows for animation
      this.linesClearedSubject.next(clearedRows);
      
      this.gameState.lines += linesCleared;
      this.gameState.score += linesCleared * 100 * this.gameState.level;
      this.gameState.level = Math.floor(this.gameState.lines / 10) + 1;
      this.dropSpeed = Math.max(100, 1000 - (this.gameState.level - 1) * 100);
    }
  }

  public startGame(): void {
    if (this.gameInterval) {
      this.gameInterval.unsubscribe();
    }
    
    this.gameInterval = interval(this.dropSpeed).subscribe(() => {
      if (!this.gameState.isPaused && !this.gameState.isGameOver) {
        this.dropPiece();
      }
    });
  }

  public pauseGame(): void {
    this.gameState.isPaused = !this.gameState.isPaused;
    this.gameSubject.next(this.gameState);
  }

  public resetGame(): void {
    if (this.gameInterval) {
      this.gameInterval.unsubscribe();
    }
    this.initializeGame();
  }

  public movePiece(direction: 'left' | 'right' | 'down'): void {
    if (!this.gameState.currentPiece || this.gameState.isGameOver || this.gameState.isPaused) return;
    
    const deltaX = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
    const deltaY = direction === 'down' ? 1 : 0;
    
    if (!this.isCollision(this.gameState.currentPiece, deltaX, deltaY)) {
      this.gameState.currentPiece.position.x += deltaX;
      this.gameState.currentPiece.position.y += deltaY;
      this.gameSubject.next(this.gameState);
    } else if (direction === 'down') {
      this.lockPiece();
      this.gameSubject.next(this.gameState);
    }
  }

  public rotatePiece(): void {
    if (!this.gameState.currentPiece || this.gameState.isGameOver || this.gameState.isPaused) return;
    
    const rotatedShape = this.rotateMatrix(this.gameState.currentPiece.shape);
    const testPiece = { ...this.gameState.currentPiece, shape: rotatedShape };
    
    if (!this.isCollision(testPiece)) {
      this.gameState.currentPiece.shape = rotatedShape;
      this.gameState.currentPiece.rotation = (this.gameState.currentPiece.rotation + 90) % 360;
      this.gameSubject.next(this.gameState);
    }
  }

  private rotateMatrix(matrix: number[][]): number[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rotated[j][rows - 1 - i] = matrix[i][j];
      }
    }
    
    return rotated;
  }

  public dropPiece(): void {
    this.movePiece('down');
  }

  public hardDrop(): void {
    if (!this.gameState.currentPiece || this.gameState.isGameOver || this.gameState.isPaused) return;
    
    while (!this.isCollision(this.gameState.currentPiece, 0, 1)) {
      this.gameState.currentPiece.position.y++;
    }
    
    this.lockPiece();
    this.gameSubject.next(this.gameState);
  }

  public getGameState(): GameState {
    return this.gameState;
  }
}
