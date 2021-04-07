import Dexie from 'dexie';
import { db } from './db';
import { nanoid } from 'nanoid/non-secure';

export class Weather {
	id = `w_${nanoid()}`;
	fieldId: string;
	year: number;
	maxTemp: Array<number>; // indexed by day of year
	minTemp: Array<number>; // indexed by day of year
	precipitation: Array<number>; // indexed by day of year

	constructor(
		fieldId: string,
		year: number,
		maxTemp: Array<number> = [],
		minTemp: Array<number> = [],
		precipitation: Array<number> = []
	) {
		this.fieldId = fieldId;
		this.year = year;
		this.maxTemp = maxTemp;
		this.minTemp = minTemp;
		this.precipitation = precipitation;
	}

	save(): Promise<string> {
		// TODO: We should throw something better. Maybe our own error types?
		if (!this.fieldId) {
			throw 'fieldId is required';
		}

		if (!this.year) {
			throw 'year is required';
		}

		return db.weather.put(this);
	}

	static async getByField(fieldId: string): Promise<Map<number, Weather>> {
		const weather: Map<number, Weather> = new Map();
		await db.weather
			.where('[fieldId+year]')
			.between([fieldId, Dexie.minKey], [fieldId, Dexie.maxKey])
			.each((w) => weather.set(w.year, w));

		return weather;
	}
}

db.weather.mapToClass(Weather);
