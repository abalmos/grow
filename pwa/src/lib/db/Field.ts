import { nanoid } from 'nanoid/non-secure';

import { db } from './db';

import type { Feature } from 'geojson';

import type { Coordinate } from '.';
import { Variety } from './Variety';

export class Field {
  id = `f_${nanoid()}`;
  name: string;
  geojson: Feature;
  area: number;
  center: Coordinate;
  varietyId: string | undefined;
  datePlanted: Date | undefined;
  numPlants: number;

  constructor(
    name: string,
    geojson: Feature,
    area: number,
    center: Coordinate
  ) {
    this.name = name;
    this.geojson = geojson;
    this.area = area;
    this.center = center;

    this.numPlants = 0; // not needed right now
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

  static async getAll(): Promise<Array<Field>> {
    return (await db.fields.toArray()) || [];
  }

  static get(id: string): Promise<Field | undefined> {
    return db.fields.get({ id });
  }

  async getVariety(): Promise<Variety | undefined> {
    console.log(this.varietyId);
    return this.varietyId ? Variety.get(this.varietyId) : undefined;
  }
}

db.fields.mapToClass(Field);
