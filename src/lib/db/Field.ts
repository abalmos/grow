import { db } from './db';
import { nanoid } from 'nanoid/non-secure';

import type { Feature } from 'geojson';
import { Weather, Variety } from '.';

export class Field {
	id = `f_${nanoid()}`;
	name: string;
	geojson: Feature;
	area: number;
	center: [number, number];
	weather: Map<number, Weather | undefined> = new Map(); // key is "year"
  varietyId: string | undefined;
  datePlanted: Date | undefined;
  numPlants: number;

	constructor(name: string, geojson: Feature, area: number, center: [number, number]) {
		this.name = name;
		this.geojson = geojson;
		this.area = area;
		this.center = center;

    this.numPlants = 0; // not needed right now 

		// Make relations non-enumerable to stop Dexie from trying to save them
		Object.defineProperties(this, {
			weather: { enumerable: false, writable: true }
		});
	}

	save(): Promise<string> {
		// TODO: We should throw something better. Maybe our own error types?
		if (!this.name) {
			throw 'name is required';
		}

		if (!this.geojson) {
			throw 'geojson is required';
		}

		if (!this.area) {
			throw 'area is required';
		}

		if (!this.center) {
			throw 'center is required';
		}

		return db.fields.put(this);
	}

	async loadWeather(): Promise<void> {
		if (this.id) {
			this.weather = await Weather.getByField(this.id);
		}
	}

	static async getAll(): Promise<Array<Field>> {
		return (await db.fields.toArray()) || [];
	}

	static get(id: string): Promise<Field | undefined> {
		return db.fields.get({ id });
	}
}

db.fields.mapToClass(Field);
