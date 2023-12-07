import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Preferences } from '@capacitor/preferences'; // Added to log data

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static LoadDefaultData:boolean = true;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	constructor() {
		if(SleepService.LoadDefaultData) {
			// this.addDefaultData();
		SleepService.LoadDefaultData = false;
	}
	}

	// private addDefaultData() {
	// 	// Changed to only add default data if database empty
	// 	if (SleepService.LoadDefaultData && SleepService.AllSleepData.length === 0) {
	// 		SleepService.AllSleepData.push(new OvernightSleepData(new Date('February 18, 2021 01:03:00'), new Date('February 18, 2021 09:25:00')));
	// 		SleepService.AllSleepData.push(new StanfordSleepinessData(4, new Date('February 19, 2021 14:38:00')));
	// 		SleepService.AllSleepData.push(new OvernightSleepData(new Date('February 20, 2021 23:11:00'), new Date('February 21, 2021 08:03:00')));
	// 		SleepService.LoadDefaultData = false;
	// 	}
	// }

	public logOvernightData(sleepData: OvernightSleepData) {
		// Check if there's already an overnight sleep log for the current date (down to the minute)
		if (this.isOvernightLogExistForDate(sleepData.getSleepStart())) {
		  console.log("You can log only one overnight sleep per day.");
		  return;
		}
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);
		this.saveData(); // Save data to Capacitor Preferences
	}

	public logSleepinessData(sleepData: StanfordSleepinessData) {
		// Check if there's already a sleepiness log for the current date and time (down to the minute)
		if (this.isSleepinessLogExistForDateTime(sleepData.loggedAt)) {
		  console.log("You can log only one sleepiness level per time.");
		  return;
		}
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);
		this.saveData(); // Save data to Capacitor Preferences
	}

	// New function to save data to Capacitor Preferences
	private async saveData() {
		await Preferences.set({
			key: 'sleepData',
			value: JSON.stringify(SleepService.AllSleepData),
		});
	}
	
	// New function to retrieve data from Capacitor Preferences
	public async loadData() {
		const { value } = await Preferences.get({ key: 'sleepData' });
		if (value) {
			SleepService.AllSleepData = JSON.parse(value);
		}
	}

	private isOvernightLogExistForDate(date: Date): boolean {
		return SleepService.AllOvernightData.some(
		  	(log) => log.getSleepStart().toISOString().slice(0, 16) === date.toISOString().slice(0, 16)
		);
	}
	
	private isSleepinessLogExistForDateTime(logDateTime: Date): boolean {
		return SleepService.AllSleepinessData.some(
			(log) => log.loggedAt.toISOString().slice(0, 16) === logDateTime.toISOString().slice(0, 16)
		);
	}
}