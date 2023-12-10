import { Component } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { NavController, ModalController, PopoverController } from '@ionic/angular';
import { LogOvernightSleepPage } from '../log-overnight-sleep/log-overnight-sleep.page';
import { LogSleepinessPage } from '../log-sleepiness/log-sleepiness.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  sleepStart: string | undefined;
  sleepEnd: string | undefined;
  sleepinessLevel: number | undefined;
  allSleepData: SleepData[] = [];
  markedDates: Date[] = [];
  selectedDateLogs: SleepData[] = [];

  constructor(
    public sleepService: SleepService,
    public navCtrl: NavController,
    public modalController: ModalController,
    public popoverController: PopoverController
  ) {
    this.loadSleepData();
  }

  ngOnInit() {
    console.log(this.allSleepData);
  }

  loadSleepData() {
    this.allSleepData = SleepService.AllSleepData;
    this.markedDates = this.allSleepData.map((sleep: SleepData) => sleep.loggedAt);
  }

	
	async logAction(actionType: 'overnight-sleep' | 'sleepiness') {
		if (actionType === 'overnight-sleep') {
		  // Open modal/popover for logging overnight sleep
		  const modal = await this.modalController.create({
			component: LogOvernightSleepPage,
		  });
		  await modal.present();
		} else if (actionType === 'sleepiness') {
		  // Open modal/popover for logging sleepiness
		  const modal = await this.modalController.create({
			component: LogSleepinessPage,
		  });
		  await modal.present();
		}
	}

	onDateClicked(date: Date) {
		console.log('Date clicked:', date);
	  
		// Filter sleep data for the clicked date
		this.selectedDateLogs = this.allSleepData.filter((log: SleepData) => {
		  const logDate = log.loggedAt.toDateString();
		  if (log instanceof OvernightSleepData) {
			// If it's an OvernightSleepData, check both sleepStart and sleepEnd dates
			const start = log.getSleepStart().toDateString();
			const end = log.getSleepEnd().toDateString();
			return start === date.toDateString() || end === date.toDateString();
		  } else {
			// If it's a regular SleepData, check the loggedAt date
			return logDate === date.toDateString();
		  }
		});
	  }
	}
