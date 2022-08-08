import Dexie from 'dexie';
import type { Table } from 'dexie';

import type { Field, Variety, Weather } from '.';

export class GrowDB extends Dexie {
	fields!: Table<Field, string>;
	varieties!: Table<Variety, string>;
	weather!: Table<Weather, [number, number]>;

	constructor() {
		super('GrowDB'); //, idb);

		this.version(5).stores({
			varieties: '&id, brand, product',
			fields: '&id',
			weather: '&[coord+year]'
		});
	}
}

export const db = new GrowDB();
