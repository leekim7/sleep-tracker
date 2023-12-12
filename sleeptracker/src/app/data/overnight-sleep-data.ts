import { SleepData } from './sleep-data';

export class OvernightSleepData extends SleepData {
	private sleepStart:Date;
	private sleepEnd:Date;

	constructor(sleepStart:Date, sleepEnd:Date) {
		super();
		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
	}

	override dateString():string {
		var sleepStart_ms = this.sleepStart.getTime();
		var sleepEnd_ms = this.sleepEnd.getTime();
		var difference_ms = sleepEnd_ms - sleepStart_ms;
		return "Overnight sleep for " + Math.floor(difference_ms / (1000*60*60)) + " hours, " + Math.floor(difference_ms / (1000*60) % 60) + " minutes";
	}

	override summaryString():string {
		var sleepStart_ms = this.sleepStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		var sleepEnd_ms = this.sleepEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		const sleepStartString = this.sleepStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + sleepStart_ms;
		const sleepEndString = this.sleepEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + sleepEnd_ms;
		return sleepStartString + ' to ' + sleepEndString;
	}

	getSleepStart(): Date {
		return this.sleepStart;
	}

	getSleepEnd(): Date {
		return this.sleepEnd;
	}
}
