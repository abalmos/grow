import { db } from '$lib/db';
import Dexie from 'dexie';
import { nanoid } from 'nanoid/non-secure';

import type { Coordinate, Year } from '.';

export class Weather {
  id = `w_${nanoid()}`;
  coord: Coordinate;
  year: Year;
  maxTemp: Array<number>; // indexed by day of year
  minTemp: Array<number>; // indexed by day of year
  precipitation: Array<number>; // indexed by day of year

  constructor(
    coord: Coordinate,
    year: Year,
    maxTemp: Array<number> = [],
    minTemp: Array<number> = [],
    precipitation: Array<number> = []
  ) {
    this.coord = coord;
    this.year = year;
    this.maxTemp = maxTemp;
    this.minTemp = minTemp;
    this.precipitation = precipitation;
  }

  save(): Promise<Coordinate> {
    // TODO: We should throw something better. Maybe our own error types?
    if (!this.coord) {
      throw 'coord is required';
    }

    if (!this.year) {
      throw 'year is required';
    }

    return db.weather.put(this);
  }

  static async get(coord: Coordinate, year: Year): Promise<Weather> {
    let w = await db.weather.get({ coord, year });

    if (!w) {
      w = new Weather(coord, year);
    }

    return w;
  }

  static async getAll(coord: Coordinate): Promise<Map<Year, Weather>> {
    const weather = new Map<Year, Weather>();

    await db.weather
      .where('[coord+year]')
      .between([coord, Dexie.minKey], [coord, Dexie.maxKey])
      .each((w) => weather.set(w.year, w));

    return weather;
  }
}

db.weather.mapToClass(Weather);
