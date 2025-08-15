import { Injectable } from '@angular/core';

export interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
  lines: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private readonly STORAGE_KEY = 'tetris-leaderboard';
  private readonly MAX_ENTRIES = 10;

  constructor() { }

  getLeaderboard(): LeaderboardEntry[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return [];
    }
    
    try {
      const entries = JSON.parse(stored);
      return entries.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
    } catch {
      return [];
    }
  }

  addScore(name: string, score: number, level: number, lines: number): boolean {
    const currentLeaderboard = this.getLeaderboard();
    
    const newEntry: LeaderboardEntry = {
      name: name.trim() || 'Anonymous',
      score,
      level,
      lines,
      date: new Date()
    };

    const updatedLeaderboard = [...currentLeaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, this.MAX_ENTRIES);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedLeaderboard));
    
    return updatedLeaderboard.findIndex(entry => 
      entry.score === score && entry.name === newEntry.name && entry.date.getTime() === newEntry.date.getTime()
    ) !== -1;
  }

  isHighScore(score: number): boolean {
    const leaderboard = this.getLeaderboard();
    return leaderboard.length < this.MAX_ENTRIES || score > leaderboard[leaderboard.length - 1].score;
  }

  clearLeaderboard(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}