<script type="ts">
  import { format, differenceInDays, getDayOfYear } from 'date-fns';
  import { goto } from '$app/navigation';
  import Leaflet from '$lib/leaflet/Leaflet.svelte';
  import GeoJson from '$lib/leaflet/GeoJson.svelte';
  import type { Field } from '$lib/db';

  import { cornGDD } from '$lib/utils/gdd';
  import { weatherStore } from '$stores/weather';

  export let field: Field;

  // Parameters of the weather computations
  const now = new Date();
  const year = now.getFullYear();
  const todayDoY = getDayOfYear(now);
  const plantDoY = getDayOfYear(field.datePlanted || now);

  // Years to base weather insights from
  const years = Array.from(new Array(6), (_, i) => year - i);

  const weather = weatherStore(field.center, years);

  // TODO: Move most of this into a util???
  let gdu = 0;
  $: {
    const w = $weather.get(year);
    if (w) {
      gdu = cornGDD(w)
        .slice(plantDoY)
        .reduce((a, b) => a + b, 0);
    }
  }

  let avgGdu = 0;
  $: {
    // TODO: We are showing GDU acculmation as of the last weather downloaded compared to the average up to today.
    //       For example: Weather downloaded 5 days ago includs only up to 5 days ago, but last years weather as the entire year
    const gduAverages = [...$weather.values()].map((w) =>
      cornGDD(w)
        .slice(plantDoY, todayDoY + 1)
        .reduce((a, b) => a + b, 0)
    );
    avgGdu = gduAverages.reduce((a, b) => a + b, 0) / gduAverages.length;
  }

  let rain = 0;
  $: {
    let thisYear = $weather.get(year);
    if (thisYear) {
      rain = thisYear.precipitation
        .slice(plantDoY)
        .filter((a) => a !== -999)
        .reduce((a, b) => a + b, 0);
    }
  }

  let avgRain = 0;
  $: {
    // TODO: We are showing GDU acculmation as of the last weather downloaded compared to the average up to today.
    //       For example: Weather downloaded 5 days ago includs only up to 5 days ago, but last years weather as the entire year
    const rainAverages = [...$weather.values()].map((w) =>
      w.precipitation
        .slice(plantDoY, todayDoY + 1)
        .filter((a) => a !== -999)
        .reduce((a, b) => a + b, 0)
    );
    avgRain = rainAverages.reduce((a, b) => a + b, 0) / rainAverages.length;
  }
</script>

<div class="w-full">
  <div class="bg-white border-b rounded-lg overflow-hidden text-left">
    <!-- TODO: this on:click really just needs to dispatch out of this component
			so that we can handle the routing in the parent. For example, this breaks
			the field uploading as is -->
    <div
      class="bg-cover bg-center"
      on:click={() => goto(`/fields/${encodeURIComponent(field.id)}`)}
    >
      <Leaflet
        class="h-56"
        zoomControl={false}
        dragable={false}
        zoomable={false}
      >
        <GeoJson geojson={field.geojson} zoomTo={true} />
      </Leaflet>
    </div>

    <div class="p-4">
      <div class="flex justify-between">
        <div class="flex-col text-left">
          <p class="text-3xl text-gray-900">{field.name || ''}</p>
          <p>{Math.round(field.area)} ac.</p>
          <p>
            <!-- TODO: Render the defaults better (right now flashes NaN -> actual number) -->
            GDD: {gdu}
            ({gdu > avgGdu
              ? `${Math.floor(gdu - avgGdu)} ahead`
              : `${Math.floor(avgGdu - gdu)} behind`})
          </p>
          <p>
            Rain: {rain.toFixed(1)} in. ({rain > avgRain
              ? `${(rain - avgRain).toFixed(1)} in. ahead`
              : `${(avgRain - rain).toFixed(1)} in. behind`})
          </p>
        </div>
        <div class="flex-col text-right">
          <p>{field.varietyId || ''}</p>
          <p class="text-lg">
            {field.datePlanted ? format(field.datePlanted, 'yyyy-MM-dd') : ''}
          </p>
          <p class="text-xs">
            {field.datePlanted
              ? `${differenceInDays(new Date(), field.datePlanted)} days ago`
              : ''}
          </p>
        </div>
      </div>
    </div>

    <!--
		<div class="flex p-4 border-t border-gray-300 text-gray-700">
			<div class="flex-1 inline-flex items-center">
				<svg
					class="h-6 w-6 text-gray-600 fill-current mr-3"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						d="M0 16L3 5V1a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4l3 11v5a1 1 0 0 1-1 1v2h-1v-2H2v2H1v-2a1 1 0 0 1-1-1v-5zM19 5h1V1H4v4h1V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h2V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1zm0 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V6h-2v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6H3.76L1.04 16h21.92L20.24 6H19zM1 17v4h22v-4H1zM6 4v4h4V4H6zm8 0v4h4V4h-4z"
					/>
				</svg>

				<p><span class="text-gray-900 font-bold">3</span> Bedrooms</p>
			</div>

			<div class="flex-1 inline-flex items-center">
				<svg
					class="h-6 w-6 text-gray-600 fill-current mr-3"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						fill-rule="evenodd"
						d="M17.03 21H7.97a4 4 0 0 1-1.3-.22l-1.22 2.44-.9-.44 1.22-2.44a4 4 0 0 1-1.38-1.55L.5 11h7.56a4 4 0 0 1 1.78.42l2.32 1.16a4 4 0 0 0 1.78.42h9.56l-2.9 5.79a4 4 0 0 1-1.37 1.55l1.22 2.44-.9.44-1.22-2.44a4 4 0 0 1-1.3.22zM21 11h2.5a.5.5 0 1 1 0 1h-9.06a4.5 4.5 0 0 1-2-.48l-2.32-1.15A3.5 3.5 0 0 0 8.56 10H.5a.5.5 0 0 1 0-1h8.06c.7 0 1.38.16 2 .48l2.32 1.15a3.5 3.5 0 0 0 1.56.37H20V2a1 1 0 0 0-1.74-.67c.64.97.53 2.29-.32 3.14l-.35.36-3.54-3.54.35-.35a2.5 2.5 0 0 1 3.15-.32A2 2 0 0 1 21 2v9zm-5.48-9.65l2 2a1.5 1.5 0 0 0-2-2zm-10.23 17A3 3 0 0 0 7.97 20h9.06a3 3 0 0 0 2.68-1.66L21.88 14h-7.94a5 5 0 0 1-2.23-.53L9.4 12.32A3 3 0 0 0 8.06 12H2.12l3.17 6.34z"
					/>
				</svg>

				<p><span class="text-gray-900 font-bold">2</span> Bathrooms</p>
			</div>
		</div>

		<div class="px-4 pt-3 pb-4 border-t border-gray-300 bg-gray-100">
			<div class="text-xs uppercase font-bold text-gray-600 tracking-wide">Realtor</div>
			<div class="flex items-center pt-2">
				<div
					class="bg-cover bg-center w-10 h-10 rounded-full mr-3"
					style="background-image: url(https://images.unsplash.com/photo-1500522144261-ea64433bbe27?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=751&q=80);"
				/>
				<div>
					<p class="font-bold text-gray-900">Tiffany Heffner</p>
					<p class="text-sm text-gray-700">(555) 555-4321</p>
				</div>
			</div>
		</div>
		-->
  </div>
</div>
