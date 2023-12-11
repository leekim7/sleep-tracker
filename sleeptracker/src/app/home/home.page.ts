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

	sleepStart: string | undefined;
	sleepEnd: string | undefined;
	sleepinessLevel: number | undefined;
	allSleepData: SleepData[] = [];
	markedDates: Date[] = [];
	selectedDateLogs: SleepData[] = [];
	clickedDate: Date | undefined;
	gesture: string = '';
	isModalOpen: boolean = false;

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
				if (!this.isModalOpen) {
					modal = await this.createAndPresentModal(LogOvernightSleepPage);
					console.log('Starting a new overnight sleep log');
				}
				break;
			case 'Closed Hand':
				if (this.isModalOpen) {
					await this.dismissModal();
					console.log('Canceling the overnight sleep log');
				}
				break;
			case 'Two Open Hands':
				if (!this.isModalOpen) {
					modal = await this.createAndPresentModal(LogSleepinessPage);
					console.log('Starting a new sleepiness log');
				}
				break;
			case 'Two Closed Hands':
				if (this.isModalOpen) {
					await this.dismissModal();
					console.log('Canceling the new sleepiness log');
				}
				break;
			case 'Hand Pinching':
				// If handtracker on, stop
				break;
			case 'Two Hands Pinching':
				// If handtracker off, start
				break;
		}
	
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

	// Method to get the current real-time date
	getCurrentRealTimeDate(): Date {
		return new Date();
	}

	// Method to handle gestures for clicking dates
	handleDateClick(date: Date): void {
		if (date) {
			this.calendar.dateClicked.emit(date);
		}
		console.log('Clicked on the date:', date);
	}
}