import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighScoreInputComponent } from './high-score-input.component';

describe('HighScoreInputComponent', () => {
  let component: HighScoreInputComponent;
  let fixture: ComponentFixture<HighScoreInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighScoreInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighScoreInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});