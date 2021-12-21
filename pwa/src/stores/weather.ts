import { Weather } from '$lib/db/Weather';

import type { Readable } from 'svelte/store';
import { readable } from 'svelte/store';
import { liveQuery } from 'dexie';

import { ACIS } from '$workers';

import type { Coordinate, Year } from '$lib/db';

export type WeatherMap = Map<Year, Weather>;

export function weatherStore(
  coord: Coordinate,
  years: Array<Year>
): Readable<WeatherMap> {
  return readable<WeatherMap>(new Map(), (set) => {
    ACIS.postMessage({ coord, years });

    const sub = liveQuery(() => Weather.getAll(coord)).subscribe(set);

    return () => {
      sub.unsubscribe();
    };
  });
}
