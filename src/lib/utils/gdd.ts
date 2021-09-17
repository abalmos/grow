import { Weather } from '$lib/db/Weather';

import type { Readable } from 'svelte/store';
import { readable } from 'svelte/store';
import { liveQuery } from 'dexie';

import type { Coordinate, Year } from '$lib/db';

// Expose Dexie liveQuery to Sevlte (where a default value is needed)
export function weatherYearStore(
  coord: Coordinate,
  year: number
): Readable<Weather | undefined> {
  return readable<Weather>(undefined, (set) => {
    let sub = liveQuery(() => Weather.get(coord, year)).subscribe(set);

    return () => {
      sub.unsubscribe();
    };
  });
}

export function weatherStore(coord: Coordinate): Readable<Map<Year, Weather>> {
  return readable<Map<Year, Weather>>(new Map(), (set) => {
    let sub = liveQuery(() => Weather.getAll(coord)).subscribe(set);

    return () => {
      sub.unsubscribe();
    };
  });
}

/*
  type AV = ??;
export function varietyStore(name: string) {
        const { subscribe, set } =  writable<AV>([]);

        let sub = liveQuery(() =>
                db.varieties.where('name').startsWithIgnoreCase(name).toArray()
        ).subscribe(set);

        return {
                subscribe: (run: (value: AV) => void, invalidate?: (value?: AV)
=> void) => { const unsubscribe = subscribe(run, invalidate);

                        return () => {
                                sub.unsubscribe();
                                unsubscribe();
                        };
                },
                filterByName: (name: string) => {
                        sub.unsubscribe();
                        sub = liveQuery(() =>
                                db.varieties.where('name').startsWithIgnoreCase(name).toArray()
                        ).subscribe(set);
                }
        };
}
*/

export function cornGDD(weather?: Weather): Array<number> {
  if (!weather) {
    return [];
  }

  const maxTemp = weather.maxTemp;
  const minTemp = weather.minTemp;

  return maxTemp.map((maxT, i) => {
    let minT = minTemp[i];
    if (!minT || minT === -999 || maxT === -999) {
      return 0;
    }

    minT = Math.max(minT, 50);
    maxT = Math.min(Math.max(maxT, 50), 86);

    return (maxT + minT) / 2.0 - 50;
  });
}
