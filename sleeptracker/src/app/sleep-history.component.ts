// sleeptracker/src/app/sleep-history.component.ts

import { Component, OnInit } from '@angular/core';
import { SleepService } from './services/sleep.service';
import { OvernightSleepData } from './data/overnight-sleep-data';

@Component({
  selector: 'app-sleep-history',
  templateUrl: './sleep-history.component.html',
  styleUrls: ['./sleep-history.component.scss']
})
export class SleepHistoryComponent implements OnInit {
  sleepHistory: OvernightSleepData[] = []; // Initialize the property

  constructor(private sleepService: SleepService) {}

  ngOnInit() {
    // Fetch and display the logged data
    this.fetchSleepHistory();
  }

  async fetchSleepHistory() {
    // Use the static member to access AllOvernightData
    this.sleepHistory = SleepService.AllOvernightData;
  }
}
