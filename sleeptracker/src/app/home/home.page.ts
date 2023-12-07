import { Component } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { NavController } from '@ionic/angular';  // Import NavController

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


	constructor(public sleepService: SleepService, public navCtrl: NavController) {
		this.loadSleepData();  // Initialize data when the page loads
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
	}

	navigateToLogOvernightSleep() {
		this.navCtrl.navigateForward('/log-overnight-sleep');
	  }

	navigateToLogSleepiness() {
		this.navCtrl.navigateForward('/log-sleepiness');
	}
}
