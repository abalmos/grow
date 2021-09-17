import { Weather } from '$lib/db/Weather';
import { getDayOfYear, format, parse } from 'date-fns';

export type FetchWeather = {
  coord: [number, number];
  years: number[];
}

// TODO: This is likely broken ??
onmessage = async function (e) {
  let r: FetchWeather = e.data;

  const today = new Date();

  for (const year of r.years) {
    let thisYear = await Weather.get(r.coord, year);

    // TODO: Only fetch this year's data IF its after the update time AND we haven't already got it today
    if (thisYear.maxTemp.length && thisYear.year !== today.getFullYear()) {
      console.info(`Already have ${today.getFullYear()} weather for (${r.coord[0]}, ${r.coord[1]})`)
      continue;
    }

    let weather = await fetch('http://data.rcc-acis.org/GridData', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sdate: `${year}-01-01`,
        edate:
          year == today.getFullYear()
            ? format(today, 'yyyy-MM-dd')
            : `${year}-12-31`,
        grid: '21',
        loc: `${r.coord[0]}, ${r.coord[1]}`,
        elems: [
          { name: 'maxt', units: 'degreeF' },
          { name: 'mint', units: 'degreeF' },
          { name: 'pcpn', units: 'inch' }
        ]
      })
    })
      .then((r) => r.json())
      .then((d) => d.data as Array<[string, number, number, number]>);

    weather.forEach(([date, maxt, mint, pcpn]) => {
      // TODO: I'm not sure about this "new Date()" so called "reference" ...
      const i = getDayOfYear(parse(date, 'yyyy-MM-dd', new Date())) - 1;
      thisYear.maxTemp[i] = maxt;
      thisYear.minTemp[i] = mint;
      thisYear.precipitation[i] = pcpn;
    });

    await thisYear.save();
  }
};

export {};
