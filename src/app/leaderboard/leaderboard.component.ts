import { Component, OnInit } from '@angular/core';
import { LeaderboardService, LeaderboardEntry } from '../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardEntry[] = [];

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.leaderboard = this.leaderboardService.getLeaderboard();
  }

  clearLeaderboard(): void {
    if (confirm('Are you sure you want to clear the leaderboard? This action cannot be undone.')) {
      this.leaderboardService.clearLeaderboard();
      this.loadLeaderboard();
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}