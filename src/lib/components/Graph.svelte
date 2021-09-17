<script lang='ts'>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let canvas: HTMLCanvasElement;
  onMount(() => {
    const ctx = canvas.getContext("2d");
    const chart = new Chart(ctx, {
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            type: "line",
            label: "My First dataset",
            backgroundColor: "black",
            borderColor: "black",
            data: [0, 10, 5, 2, 20, 30, 45]
          },
          {
            type: "bar",
            label: "My second dataset",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: [19, 4, 5, 2, 1, 2, 45]
          }
        ]
      },
      options: {}
      });
  });
</script>

<div>
  <p>Hello - </p>
  <canvas bind:this={canvas} />
</div>

