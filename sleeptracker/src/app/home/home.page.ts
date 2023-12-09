import { Component } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { NavController, ModalController, PopoverController } from '@ionic/angular';
import { LogOvernightSleepPage } from '../log-overnight-sleep/log-overnight-sleep.page';
import { LogSleepinessPage } from '../log-sleepiness/log-sleepiness.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	sleepStart: string | undefined; // New property to store sleep start time
	sleepEnd: string | undefined; // New property to store sleep end time
	sleepinessLevel: number | undefined; // Initialize as undefined
	allSleepData: SleepData[] = [];
	logTime: string | undefined; // New property to store log time
	markedDates: Date[] = [];

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

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	// get allSleepData() {
	// 	return SleepService.AllSleepData;
	// }

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
}
