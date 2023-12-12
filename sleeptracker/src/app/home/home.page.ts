import { Component, OnInit, ViewChild } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { NavController, ModalController, PopoverController } from '@ionic/angular';
import { LogOvernightSleepPage } from '../log-overnight-sleep/log-overnight-sleep.page';
import { LogSleepinessPage } from '../log-sleepiness/log-sleepiness.page';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { PredictionEvent } from '../prediction-event'; 
import { HandtrackerComponent } from '../handtracker/handtracker.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	@ViewChild('calendar') calendar: any;
	@ViewChild(HandtrackerComponent) handtrackerComponent!: HandtrackerComponent;

	sleepStart: string | undefined;
	sleepEnd: string | undefined;
	sleepinessLevel: number | undefined;
	allSleepData: SleepData[] = [];
	markedDates: Date[] = [];
	selectedDateLogs: SleepData[] = [];
	clickedDate: Date = new Date();
	gesture: string = '';
	isModalOpen: boolean = false;

	constructor(
		public sleepService: SleepService,
		public navCtrl: NavController,
		public modalController: ModalController,
		public popoverController: PopoverController
	) {
		this.loadSleepData();
		this.clickedDate = new Date();
	}

	ngOnInit() {
		this.loadSleepData();
		console.log('Selected Date Logs:', this.selectedDateLogs);
		console.log('Clicked Date:', this.clickedDate);
	}

	loadSleepData() {
		this.allSleepData = SleepService.AllSleepData;
		this.markedDates = this.allSleepData.map((sleep: SleepData) => sleep.loggedAt);
	}
	
	async logAction(actionType: 'overnight-sleep' | 'sleepiness') {
		this.isModalOpen = true;
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
		this.isModalOpen = false;
	}

	onDateClicked(date: Date) {
		console.log('Date clicked:', date);
		this.clickedDate = date;
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

	async onGestureDetected(event: PredictionEvent) {
		this.gesture = event.getPrediction();
		console.log('Detected Gesture:', this.gesture);
		let modal: HTMLIonModalElement | undefined;
	
		switch (this.gesture) {
			case 'Open Hand':
				console.log('Starting a new overnight sleep log');
				modal = await this.createAndPresentModal(LogOvernightSleepPage);
				break;
			case 'Closed Hand':
				console.log('Canceling the overnight sleep log');
				await this.dismissModal();
				break;
			case 'Two Open Hands':
				console.log('Starting a new sleepiness log');
				modal = await this.createAndPresentModal(LogSleepinessPage);
				break;
			case 'Two Closed Hands':
				console.log('Canceling the new sleepiness log');
				await this.dismissModal();
				break;
			case 'Hand Pinching':
				console.log('Stopping hand detection');
				this.handtrackerComponent.stopDetection();
				break;
			case 'Hand Pointing Right':
				console.log('Navigating to following month');
				this.calendar.onClick(new Date(this.clickedDate.getFullYear(), this.clickedDate.getMonth() + 1, 1));
				break;
			case 'Hand Pointing Left':
				console.log('Navigating to preceding month');
				this.calendar.onClick(new Date(this.clickedDate.getFullYear(), this.clickedDate.getMonth() - 1, 1));
				break;
		}

		// Reset the gesture display after handling
		this.gesture = '';
	
		if (modal) {
			await modal.present();
		}
	}

	private async createAndPresentModal(component: any): Promise<HTMLIonModalElement> {
		const modal = await this.modalController.create({
			component,
		});
		this.isModalOpen = true;
		return modal;
	}
	  
	private async dismissModal(): Promise<void> {
		if (this.isModalOpen) {
			await this.modalController.dismiss();
			this.isModalOpen = false;
		}
	}
}