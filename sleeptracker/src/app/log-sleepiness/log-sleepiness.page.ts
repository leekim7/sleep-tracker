import { Component } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-log-sleepiness',
  templateUrl: 'log-sleepiness.page.html',
  styleUrls: ['log-sleepiness.page.scss'],
})
export class LogSleepinessPage {
  sleepStart: string | undefined;
	sleepEnd: string | undefined; 
	sleepinessLevel: number | undefined;
	allSleepData: SleepData[] = [];
	logTime: string | undefined; 


	constructor(public sleepService: SleepService,
		public toastController: ToastController,
		public modalController: ModalController) {
		this.loadSleepData();
	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	async logSleepiness() {

		if (!this.logTime) {
			this.presentToast('Please select a log time.');
			return;
		  }
		const logDateTime = new Date(this.logTime);
    	const logTime = logDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

		if (this.sleepinessLevel !== undefined && this.sleepinessLevel >= 1 && this.sleepinessLevel <= 7) {
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

			const sleepinessData = new StanfordSleepinessData(this.sleepinessLevel, logTime, logDateTime);
			this.sleepService.logSleepinessData(sleepinessData);
			this.loadSleepData();
			this.sleepinessLevel = undefined;
			this.logTime = undefined;
			this.presentToast('Sleepiness level logged successfully.');
		} else {
		 	this.presentToast('Invalid sleepiness level. Please select a level between 1 and 7.');
		}
		await this.modalController.dismiss();
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
