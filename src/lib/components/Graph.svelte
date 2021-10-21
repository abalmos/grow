<script lang="ts">
  import { onMount, afterUpdate, onDestroy } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import annotationPlugin from 'chartjs-plugin-annotation';

  Chart.register(...registerables, annotationPlugin);

  export let today: number;
  export let days: number[];
  export let gduCumulat: number[];
  export let fieldGdu: number;

  let lineData: object;
  let options: object;

  let canvas: HTMLCanvasElement;
  let chart = null;
  onMount(() => {
    console.log('days', days);

    const ctx = canvas.getContext('2d');

    // divide known gdu's until today into seperate lines
    let dayOfYear = 0;
    const knownGdus = gduCumulat
      .slice(0, today)
      .map((gdu) => ({ x: dayOfYear++, y: gdu }));
    const forecastGdus = gduCumulat
      .slice(today)
      .map((gdu) => ({ x: dayOfYear++, y: gdu }));

    lineData = {
      labels: days,
      datasets: [
        {
          type: 'line',
          label: 'known gdus',
          backgroundColor: 'red',
          borderColor: 'red',
          data: forecastGdus
        },
        {
          type: 'line',
          label: 'forecast gdus',
          backgroundColor: 'black',
          borderColor: 'black',
          data: knownGdus
        }
      ]
    };

    options = {
      responsive: true,
      plugins: {
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              scaleID: 'x',
              xMin: 2000,
              xMax: 2000,
              value: 2000,
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 5
            }
          }
        }
      }
    };

    chart = new Chart(ctx, {
      data: lineData,
      options: options
    });
  });
  // afterUpdate(() => {
  //   if (!chart) return;
  //   console.log('in after update');

  //   chart.type = 'line';
  //   chart.data = lineData;
  //   chart.options = options;
  //   chart.update()
  // });

  onDestroy(() => {
    chart = null;
  });
</script>

<div>
  <!-- {#if days.length != 0 && gduCumulat.length != 0}
    <canvas bind:this={canvas} />
  {:else}
    <p>Loading...</p>
  {/if} -->
  <canvas bind:this={canvas} />
</div>
