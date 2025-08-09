import { TestBed } from '@angular/core/testing';

import { TetrisGameService } from './tetris-game.service';

describe('TetrisGameService', () => {
  let service: TetrisGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TetrisGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
