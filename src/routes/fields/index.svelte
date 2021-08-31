<script context="module" lang="ts">
  import { Field } from '$lib/db';
  import FieldCard from '$lib/FieldCard.svelte';
</script>

<header class="sticky top-0 bg-purdue-gray shadow z-500">
  <h1 class="p-3 text-white font-semibold">Fields</h1>
</header>

<!-- TODO: Find the pattern we like best .... -->
{#await Field.getAll()}
  <!-- Fetching from IndexedDB -->
{:then fields}
  <div class="m-2 card-grid">
    {#each fields as field (field.id)}
      <FieldCard {field} />
    {/each}
  </div>
{/await}
