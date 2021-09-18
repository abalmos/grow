import type { Weather } from '$lib/db/Weather';

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
