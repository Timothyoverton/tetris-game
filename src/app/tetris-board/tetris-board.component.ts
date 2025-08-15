import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { TetrisGameService } from '../services/tetris-game.service';
import { LeaderboardService } from '../services/leaderboard.service';
import { GameState, TetrisPiece, BOARD_WIDTH, BOARD_HEIGHT } from '../models/tetris.model';

@Component({
  selector: 'app-tetris-board',
  templateUrl: './tetris-board.component.html',
  styleUrls: ['./tetris-board.component.css']
})
export class TetrisBoardComponent implements OnInit, OnDestroy {
  gameState: GameState | null = null;
  gameSubscription: Subscription | null = null;
  displayBoard: string[][] = [];
  explosionCells: Set<string> = new Set();
  showHighScoreInput: boolean = false;
  lastGameOverScore: number = 0;
  hasCheckedHighScore: boolean = false;

  constructor(
    private tetrisService: TetrisGameService,
    private leaderboardService: LeaderboardService
  ) { }

  ngOnInit(): void {
    this.gameSubscription = this.tetrisService.gameState$.subscribe(state => {
      this.gameState = state;
      this.updateDisplayBoard();
      this.checkGameOver();
    });
    
    // Subscribe to line clearing events for animation
    this.tetrisService.linesCleared$.subscribe(clearedRows => {
      if (clearedRows.length > 0) {
        this.triggerExplosionAnimation(clearedRows);
      }
    });
    
    this.tetrisService.startGame();
  }

  ngOnDestroy(): void {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.tetrisService.movePiece('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.tetrisService.movePiece('right');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.tetrisService.movePiece('down');
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.tetrisService.rotatePiece();
        break;
      case ' ':
        event.preventDefault();
        this.tetrisService.hardDrop();
        break;
      case 'p':
      case 'P':
        event.preventDefault();
        this.tetrisService.pauseGame();
        break;
    }
  }

  private updateDisplayBoard(): void {
    if (!this.gameState) return;

    // Start with the base board
    this.displayBoard = this.gameState.board.map(row => [...row]);

    // Add current piece to display board
    if (this.gameState.currentPiece) {
      this.addPieceToDisplay(this.gameState.currentPiece);
    }
  }

  private addPieceToDisplay(piece: TetrisPiece): void {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = piece.position.x + x;
          const boardY = piece.position.y + y;
          
          if (boardX >= 0 && boardX < BOARD_WIDTH && boardY >= 0 && boardY < BOARD_HEIGHT) {
            this.displayBoard[boardY][boardX] = piece.color;
          }
        }
      }
    }
  }

  getCellStyle(row: number, col: number): any {
    const color = this.displayBoard[row] ? this.displayBoard[row][col] : '';
    const cellKey = `${row}-${col}`;
    
    return {
      'background-color': color || '#f5f5f5',
      'border': '1px solid #ddd',
      'animation': this.explosionCells.has(cellKey) ? 'explosion 0.5s ease-out' : 'none'
    };
  }

  startGame(): void {
    this.showHighScoreInput = false;
    this.hasCheckedHighScore = false;
    this.tetrisService.resetGame();
    this.tetrisService.startGame();
  }

  pauseGame(): void {
    this.tetrisService.pauseGame();
  }


  private checkGameOver(): void {
    if (this.gameState?.isGameOver && !this.hasCheckedHighScore) {
      this.hasCheckedHighScore = true;
      this.lastGameOverScore = this.gameState.score;
      
      if (this.leaderboardService.isHighScore(this.gameState.score)) {
        this.showHighScoreInput = true;
      }
    }
  }

  onSubmitHighScore(playerName: string): void {
    if (this.gameState) {
      this.leaderboardService.addScore(
        playerName,
        this.gameState.score,
        this.gameState.level,
        this.gameState.lines
      );
    }
    this.showHighScoreInput = false;
  }

  onSkipHighScore(): void {
    this.showHighScoreInput = false;
  }

  getRange(n: number): number[] {
    return Array(n).fill(0).map((_, i) => i);
  }

  private triggerExplosionAnimation(clearedRows: number[]): void {
    // Add explosion animation to all cells in cleared rows
    clearedRows.forEach(row => {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        const cellKey = `${row}-${col}`;
        this.explosionCells.add(cellKey);
      }
    });

    // Remove animation after it completes
    setTimeout(() => {
      clearedRows.forEach(row => {
        for (let col = 0; col < BOARD_WIDTH; col++) {
          const cellKey = `${row}-${col}`;
          this.explosionCells.delete(cellKey);
        }
      });
    }, 500);
  }
}
