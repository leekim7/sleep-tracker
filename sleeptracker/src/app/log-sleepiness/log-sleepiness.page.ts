import { Component } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-log-sleepiness',
  templateUrl: 'log-sleepiness.page.html',
  styleUrls: ['log-sleepiness.page.scss'],
})
export class LogSleepinessPage {
  sleepStart: string | undefined; // New property to store sleep start time
	sleepEnd: string | undefined; // New property to store sleep end time
	sleepinessLevel: number | undefined; // Initialize as undefined
	allSleepData: SleepData[] = [];
	logTime: string | undefined; // New property to store log time


	constructor(public sleepService: SleepService, public toastController: ToastController) {
		this.loadSleepData();  // Initialize data when the page loads
	}

	ngOnInit() {
		console.log(this.allSleepData);
	}
	// Method to log sleepiness data
	logSleepiness() {
		if (this.sleepinessLevel !== undefined && this.sleepinessLevel >= 1 && this.sleepinessLevel <= 7) {
			if (!this.logTime) {
				this.presentToast('Please select a log time.');
				return;
			}
			const logDateTime = new Date(this.logTime);
			const currentDate = new Date();
			if (logDateTime > currentDate) {
				this.presentToast('Cannot log sleepiness level in the future.');
				return;
			}
			if (this.isSleepinessLogExistForDateTime(logDateTime)) {
				this.presentToast('You can log only one sleepiness level per time.');
				return;
			}

			const sleepinessData = new StanfordSleepinessData(this.sleepinessLevel, logDateTime);
			this.sleepService.logSleepinessData(sleepinessData);
			this.loadSleepData();
			this.sleepinessLevel = undefined;
			this.logTime = undefined;
			this.presentToast('Sleepiness level logged successfully.');
		} else {
		 	this.presentToast('Invalid sleepiness level. Please select a level between 1 and 7.');
		}
	}
  loadSleepData() {
		this.allSleepData = SleepService.AllSleepData;
	}
	
	private isOvernightLogExistForDate(date: Date): boolean {
		return SleepService.AllOvernightData.some(log => log.getSleepStart().toDateString() === date.toDateString());
	}

	private isSleepinessLogExistForDateTime(logDateTime: Date): boolean {
		return SleepService.AllSleepinessData.some(log => log.loggedAt.getTime() === logDateTime.getTime());
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
