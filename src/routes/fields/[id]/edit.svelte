<script context="module" lang="ts">
  import { format } from 'date-fns';

  import { goto } from '$app/navigation';
  import { Field } from '$lib/db';
  import { Variety } from '$lib/db';

  import type { Load } from '@sveltejs/kit';

  import Header from '$lib/components/Header.svelte';
  import SelectVariety from '$lib/components/SelectVariety.svelte';

  export const load: Load = async ({ page }) => {
    // TODO: Can I reduce this boiler plate some how??
    const field = await Field.get(page.params['id'] || '');
    if (!field) {
      return goto('/fields', { replaceState: true });
    }

    // I will use the rest of each product's data to display it in a better way for the select
    // a way that shows the gdu values and brand in some kind of custom Select component
    let varieties: Variety[] = await Variety.getAllProducts();

    return {
      props: { varieties, field }
    };
  };
</script>

<script lang="ts">
  export let field: Field;

  let plantDate = format(field.datePlanted || 0, 'yyyy-MM-dd');
  let varietyId = field.varietyId;

  // export let varieties: Variety;

  function updateVarietyField(variety: Variety) {
    varietyId = variety.product;
  }

  async function handleEditFormSubmit() {
    field.datePlanted = new Date(plantDate);
    field.varietyId = varietyId;

    await field.save();

    return goto(`/fields/${field.id}`, { replaceState: true });
  }
</script>

<Header backPath={'/fields/' + field.id} showButton={false} />

<form
  on:submit|preventDefault={handleEditFormSubmit}
  class="w-5/6 mx-auto h-full flex flex-col justify-between p-8"
>
  <div class="flex flex-wrap mb-14">
    <label class="w-full">
      <span><span class="text-purdue-metallic">*</span> Planted on</span>
      <input id="date" type="date" bind:value={plantDate} required />
    </label>

    <label class="w-full">
      <span><span class="text-purdue-metallic">*</span>Selected Variety</span>
      <input id="variety" type="text" bind:value={varietyId} disabled />
    </label>

    <div class="w-full h-1/2 mt-3">
      <SelectVariety handleOnClick={updateVarietyField} />
    </div>

    <button class="mt-4" type="submit">Confirm Edit</button>
  </div>
</form>
