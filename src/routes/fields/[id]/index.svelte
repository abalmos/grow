<script context="module" lang="ts">
	import { goto } from '$app/navigation';
	import { Field } from '$lib/db';
	//import { Weather } from '$lib/db'; 
	import Leaflet from '$lib/leaflet/Leaflet.svelte';
	import GeoJson from '$lib/leaflet/GeoJson.svelte';

	import dayjs from 'dayjs';

	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page /*, fetch */}) => {
		const id = page.params['id'] || "";
		const field = await Field.get(id);

		if (!field) {
			return goto('/fields');
		}

		await field.loadWeather();

/*
		///// THIS BLOCK OF CODE SUCKS AND IS KINDA SLOW ...
		///// YOU MAY WANT TO COMMENT THIS WHOLE BLOCK AFTER LOADING IN SOME WEATHER
		///// DATA INTO INDEXEDDB

		// DO NOT RELAY ON THIS CODE BEING HERE. ONLY GET WEATHER DATA FROM THE DB.
		// THIS CODE WILL MOVE TO A SERVICE WORKER SOME DAY AND WILL UPDATE THE DATA
		// FROM BEHIND. BECAUSE OF THIS YOU SHOULD USE A LIVE QUERY TO ACCESS THE
		// DATA>
		for (const year of [2021, 2020, 2019, 2018, 2017]) {
			let thisYear = field.weather.get(year) || new Weather(id, year);
			let weather = await fetch('http://data.rcc-acis.org/GridData', {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					sdate: `${year}-01-01`,
					edate: year == new Date().getFullYear() ? dayjs().format('YYYY-MM-DD') : `${year}-12-31`,
					grid: '21',
					loc: `${field.center[0]}, ${field.center[1]}`,
					elems: [
						{ name: 'maxt', units: 'degreeF' },
						{ name: 'mint', units: 'degreeF' },
						{ name: 'pcpn', units: 'inch' }
					]
				})
			})
				.then((r) => r.json())
				.then((d) => d.data as Array<[string, number, number, number]>);

			weather.forEach(([_, maxt, mint, pcpn], i) => {
				thisYear.maxTemp[i] = maxt;
				thisYear.minTemp[i] = mint;
				thisYear.precipitation[i] = pcpn;
			});

			await thisYear.save();
			field.weather.set(2021, thisYear);
		}
  */

		///// END CODE THAT SHOULDN'T BE HERE

		///// END THIS BLOCK OF CODE SUCKS

		return {
			props: { field }
		};
	};
</script>


<script lang="ts">
  import Graph from '$lib/components/Graph.svelte';

  import Header from '$lib/components/Header.svelte';
import FieldCard from '$lib/FieldCard.svelte';

	export let field: Field;

  console.log(field);

  function handleOpenEdit() {
    goto('/fields/' + field.id + '/edit');
  }
</script>

<Header handleButtonClick={handleOpenEdit} backPath='/fields'/>

<!-- {#if showEditModal}
  <Modal on:click={toggleEditModal}>
    <form on:submit={handleEditFormSubmit} class='w-full h-full flex flex-col justify-between p-8'>
      <div class='flex flex-wrap'>
        <label class='w-full'>
          <span><span class="text-purdue-metallic">*</span> Variety</span>
          <select required>
            <option>variety 1</option>
            <option>variety 2</option>
            <option>variety 3</option>
          </select>
        </label>
        <label class='w-full'>
          <span><span class="text-purdue-metallic">*</span> Number of plants</span>
          <input type="number" required/>
        </label>
        <label class='w-full'>
          <span><span class="text-purdue-metallic">*</span> Planted on</span>
          <input type="date" required/>
        </label>
      </div>
      <button type='submit'>Confirm Edit</button>
    </form>
  </Modal>
{/if} -->


<div class="w-full">
 <!--
	<div class="bg-white shadow-xl overflow-hidden text-left">
		<div class="bg-cover bg-center">
			<Leaflet class="h-56" zoomControl={false} dragable={false} zoomable={false}>
				<GeoJson geojson={field.geojson} zoomTo={true} />
			</Leaflet>
		</div>

		<div class="p-4">
			<div class="flex justify-between tracking-wide text-sm text-gray-700">
				<p>
					{Math.round(field.area)} ac.
				</p>
        <p>{field.varietyId}</p>
				<p>Planted on {dayjs(field.datePlanted).format('YYYY-MM-DD')}</p>
			</div>
			<p class="text-3xl text-gray-900">{field.name || ''}</p>
		</div>

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
				<p>
					<span class="text-gray-900 font-bold">{field.weather.get(2021)?.maxTemp[0]}</span>
					Degrees on Jan 1
				</p>
			</div>
		</div>
	</div>
  -->

  <FieldCard {field} />

  <div class="mb-16 p-4">
    <Graph weather={field.weather} />
  </div>
</div>
