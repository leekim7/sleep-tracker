import { Component, Input, Output, EventEmitter } from '@angular/core';
import { format } from 'date-fns';
import { ChunkPipe } from '../chunk.pipe';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Input() markedDates: Date[] = [];
  @Output() dateClicked = new EventEmitter<Date>();

  currentDate: Date = new Date();
  monthDays: (Date | null)[] = [];

  constructor() {
    this.generateMonthDays();
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

  onClick(date: Date | null): void {
    if (date) {
      this.dateClicked.emit(date);
    }
  }
}
