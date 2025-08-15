import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-high-score-input',
  templateUrl: './high-score-input.component.html',
  styleUrls: ['./high-score-input.component.css']
})
export class HighScoreInputComponent {
  @Input() score: number = 0;
  @Input() level: number = 0;
  @Input() lines: number = 0;
  @Output() submitScore = new EventEmitter<string>();
  @Output() skipScore = new EventEmitter<void>();

  playerName: string = '';

  onSubmit(): void {
    this.submitScore.emit(this.playerName);
  }

  onSkip(): void {
    this.skipScore.emit();
  }
}