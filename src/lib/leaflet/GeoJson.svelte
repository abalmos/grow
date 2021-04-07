<script lang="ts">
	// FIXME: This whole thing is kinda wonky, but works
	import { getContext, onDestroy, createEventDispatcher } from 'svelte';
	import type { Map, GeoJSON as LeafletGeoJSON } from 'leaflet';
	import type { GeoJSON } from 'geojson';
	import { browser } from '$app/env';

	export let geojson: GeoJSON;
	export let zoomTo = false;

	const map = (getContext('map') as () => Map)();
	const dispatch = createEventDispatcher();

	let shape: LeafletGeoJSON;
	async function setupLeafletGeoJSON() {
		const geoJSON = (await import('leaflet')).geoJSON;

		shape = geoJSON(geojson, {
			style: () => ({
				color: '#ddb945',
				weight: 2,
				fillOpacity: 0.3 /* selected 0.8 */
			})
		})
			.on('click', (e) => dispatch('click', e))
			.addTo(map);

		// FIXME: This should be a callable action methinks
		if (zoomTo) {
			map.fitBounds(shape.getBounds().pad(0.1));
		}
	}

	onDestroy(() => {
		shape?.remove();
	});

	let leafletGeoJson = browser ? setupLeafletGeoJSON() : null;
</script>

{#await leafletGeoJson then _}
	<slot />
{/await}
