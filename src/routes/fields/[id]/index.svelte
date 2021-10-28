<script context="module" lang="ts">
  import { goto } from '$app/navigation';
  import { Field, Year } from '$lib/db';
  //import { Weather } from '$lib/db';

  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ page /*, fetch */ }) => {
    const id = page.params['id'] || '';
    const field = await Field.get(id);

    if (!field) {
      return goto('/fields');
    }

    return {
      props: { field }
    };
  };
</script>

<script lang="ts">
  import '@carbon/charts/styles.min.css';
  import 'carbon-components/css/carbon-components.min.css';
  import { LineChart } from '@carbon/charts-svelte';
  import Header from '$lib/components/Header.svelte';
  import FieldCard from '$lib/components/FieldCard.svelte';
  import { weatherStore } from '$stores/weather';
  import { cornGDU, GDU } from '$lib/utils/gdd';
  import { addDays, getDayOfYear } from 'date-fns';

  export let field: Field;

  function handleOpenEdit() {
    goto('/fields/' + field.id + '/edit');
  }

  // Parameters of the weather computations
  const now = new Date();
  const year = now.getFullYear();
  const todayDoY = getDayOfYear(now);
  const plantDoY = getDayOfYear(field.datePlanted || now);

  // Years to base weather insights from
  const years = Array.from(new Array(6), (_, i) => year - i);
  const weather = weatherStore(field.center, years);

  let gdu: Map<Year, GDU> | undefined;
  let data: Array<{ group: string; date: Date; value: number }> = [];
  $: {
    gdu = cornGDU($weather);
    if (gdu) {
      let last = 0;
      data = gdu.get(year)?.map((v, doy) => {
        last += v;
        return {
          group: 'GDU',
          date: addDays(new Date(2021, 0), doy),
          value: last
        };
      });
    }
  }
</script>

<Header handleButtonClick={handleOpenEdit} backPath="/fields" />

<FieldCard {field} />

<div class="container p-6">
  <LineChart
    {data}
    options={{
      title: 'Line (time series)',
      data: {
        loading: false
      },
      axes: {
        bottom: {
          title: 'Date',
          mapsTo: 'date',
          scaleType: 'time',
          ticks: {
            rotation: 'always'
          }
        },
        left: {
          mapsTo: 'value',
          title: 'Accumlated GDU',
          scaleType: 'linear'
        }
      },
      timeScale: {
        addSpaceOnEdges: 0
      },
      experimental: true,
      zoomBar: {
        top: {
          enabled: true
        }
      },
      curve: 'curveMonotoneX',
      height: '400px'
    }}
  />
</div>
