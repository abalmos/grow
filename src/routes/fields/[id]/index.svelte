<script context="module" lang="ts">
  import { goto } from '$app/navigation';
  import { Field } from '$lib/db';
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
  /* import Graph from '$lib/components/Graph.svelte'; */
  import Header from '$lib/components/Header.svelte';
  import FieldCard from '$lib/FieldCard.svelte';

  export let field: Field;

  function handleOpenEdit() {
    goto('/fields/' + field.id + '/edit');
  }
</script>

<Header handleButtonClick={handleOpenEdit} backPath="/fields" />

<div class="w-full">
  <FieldCard {field} />

  <div class="mb-16 p-4">
    <!-- <Graph weather={field.weather} /> -->
  </div>
</div>
