import { Component, Input, Output, EventEmitter } from '@angular/core';
import { format, addMonths, subMonths } from 'date-fns';
import { ChunkPipe } from '../chunk.pipe';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Input() markedDates: Date[] = [];
  @Output() dateClicked = new EventEmitter<Date>();
  @Output() monthChanged = new EventEmitter<Date>();

  currentDate: Date = new Date();
  monthDays: (Date | null)[] = [];
  clickedDate: Date | null = null;

  constructor() {
    this.generateMonthDays();
    this.monthChanged.emit(this.currentDate);
  }

  generateMonthDays() {
    const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
  
    const daysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) =>
      new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), i + 1)
    );
  
    const daysBeforeFirst = firstDayOfMonth.getDay();
    const daysAfterLast = 6 - lastDayOfMonth.getDay();
  
    this.monthDays = [
      ...Array.from({ length: daysBeforeFirst }, (_, i) => null),
      ...daysInMonth,
      ...Array.from({ length: daysAfterLast }, (_, i) => null),
    ];
  }
  
  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isMarked(date: Date): boolean {
    return this.markedDates.some((markedDate) => markedDate.toDateString() === date.toDateString());
  }

  previousMonth() {
    this.currentDate = subMonths(this.currentDate, 1);
    this.generateMonthDays();
    this.monthChanged.emit(this.currentDate);
  }

  nextMonth() {
    this.currentDate = addMonths(this.currentDate, 1);
    this.generateMonthDays();
    this.monthChanged.emit(this.currentDate);
  }

  onClick(date: Date | null): void {
    if (date) {
      this.dateClicked.emit(date);
      this.currentDate = date;
    }
  }

  
  
}