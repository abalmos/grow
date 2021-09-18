import { Weather } from '$lib/db/Weather';

import type { Readable } from 'svelte/store';
import { readable } from 'svelte/store';
import { liveQuery } from 'dexie';

import { weatherWorker } from '../../worker';

import type { Coordinate, Year } from '$lib/db';

export function weatherStore(
  coord: Coordinate,
  years: Array<Year>
): Readable<Map<Year, Weather>> {
  return readable<Map<Year, Weather>>(new Map(), (set) => {
    weatherWorker.postMessage({ coord, years });

    let sub = liveQuery(() => Weather.getAll(coord)).subscribe(set);

    return () => {
      sub.unsubscribe();
    };
  });
}
