import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogOvernightSleepPage } from './log-overnight-sleep.page';

describe('LogOvernightSleepPage', () => {
  let component: LogOvernightSleepPage;
  let fixture: ComponentFixture<LogOvernightSleepPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LogOvernightSleepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
