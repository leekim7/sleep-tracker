import { Component } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-log-overnight-sleep',
  templateUrl: 'log-overnight-sleep.page.html',
  styleUrls: ['log-overnight-sleep.page.scss'],
})
export class LogOvernightSleepPage {
	sleepStart: string | undefined; // New property to store sleep start time
	sleepEnd: string | undefined; // New property to store sleep end time
	sleepinessLevel: number | undefined; // Initialize as undefined
	allSleepData: SleepData[] = [];
	logTime: string | undefined; // New property to store log time


	constructor(public sleepService: SleepService, public toastController: ToastController) {
		this.loadSleepData();  // Initialize data when the page loads
	}

  @Component({
    selector: 'app-log-overnight-sleep',
    templateUrl: 'log-overnight-sleep.page.html',  // Make sure this points to the correct file
    styleUrls: ['log-overnight-sleep.page.scss'],
  })

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	// get allSleepData() {
	// 	return SleepService.AllSleepData;
	// }

	logOvernightSleep() {
		const start = this.sleepStart ? new Date(this.sleepStart) : undefined;
		const end = this.sleepEnd ? new Date(this.sleepEnd) : undefined;
		const currentDate = new Date();
		if (!start || !end || start >= end) {
			this.presentToast('Invalid input. Sleep start time must be before sleep end time.');
		  	return;
		}
		if (this.isOvernightLogExistForDate(start)) {
			this.presentToast('You can log only one overnight sleep per day.');
			return;
		}
		if (end > currentDate) {
		  	this.presentToast('Cannot log overnight sleep in the future.');
		  	return;
		}

		const overnightSleepData = new OvernightSleepData(start, end);
		this.sleepService.logOvernightData(overnightSleepData);
		this.loadSleepData();
		this.sleepStart = undefined;
		this.sleepEnd = undefined;
		this.presentToast('Overnight sleep logged successfully.');
	}

	loadSleepData() {
		this.allSleepData = SleepService.AllSleepData;
	}
	
	private isOvernightLogExistForDate(date: Date): boolean {
		return SleepService.AllOvernightData.some(log => log.getSleepStart().toDateString() === date.toDateString());
	}

	private async presentToast(message: string) {
		const toast = await this.toastController.create({
			message: message,
			duration: 2000,
			position: 'bottom',
		});
		toast.present();
	}
}
