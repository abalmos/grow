import Dexie from 'dexie';

import type { Field, Variety, Weather } from '.';

export class GrowDB extends Dexie {
	fields: Dexie.Table<Field, string>;
	varieties: Dexie.Table<Variety, string>;
	weather: Dexie.Table<Weather, string>;

	constructor() {
		super('GrowDB'); //, idb);

		this.version(1).stores({
			varieties: '&id, brand, product',
			fields: '&id',
			weather: '[fieldId+year]'
		});

		// Give TS a hint
		this.varieties = this.table('varieties');
		this.fields = this.table('fields');
		this.weather = this.table('weather');
	}
}

export const db = new GrowDB();
