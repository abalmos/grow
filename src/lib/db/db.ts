import Dexie from 'dexie';

import type { Field, Variety, Weather, } from '.';

export class GrowDB extends Dexie {
  fields: Dexie.Table<Field, string>;
  varieties: Dexie.Table<Variety, string>;
  weather5: Dexie.Table<Weather, [number, number]>;

  constructor() {
    super('GrowDB'); //, idb);

    this.version(5).stores({
      varieties: '&id, brand, product',
      fields: '&id',
      weather: '[fieldId+year]',
      weather5: '&[coord+year]'
    });

    // Give TS a hint
    this.varieties = this.table('varieties');
    this.fields = this.table('fields');
    this.weather5 = this.table('weather5');
  }
}

export const db = new GrowDB();
