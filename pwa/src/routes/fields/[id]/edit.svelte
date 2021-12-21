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

    const variety = (await field.getVariety()) || Variety.default();

    // I will use the rest of each product's data to display it in a better way for the select
    // a way that shows the gdu values and brand in some kind of custom Select component
    let varieties: Variety[] = await Variety.getAllProducts();

    return {
      props: { varieties, field, variety }
    };
  };
</script>

<script lang="ts">
  export let field: Field;
  export let variety: Variety;

  let plantDate = format(field.datePlanted || 0, 'yyyy-MM-dd');

  // export let varieties: Variety;

  function updateVarietyField(newVariety: Variety) {
    variety = newVariety;
  }

  async function handleEditFormSubmit() {
    field.datePlanted = new Date(plantDate);
    field.varietyId = variety.id;

    await field.save();

    return goto(`/fields/${field.id}`, { replaceState: true });
  }
</script>

<Header title={`Edit: ${field.name}`} backPath={'/fields/' + field.id} />

<div class="flex flex-col gap-2 px-2">
  <div class="form-control">
    <label class="label" for="plantDate">
      <span class="label-text">* Planted on</span>
      <input
        id="plantDate"
        type="date"
        bind:value={plantDate}
        required
        aria-required
        class="input"
      />
    </label>
  </div>

  <div class="form-control">
    <label class="label" for="variety">
      <span class="label-text">* Variety: {variety.product}</span>
    </label>
    <!-- <input -->
    <!--   id="variety" -->
    <!--   type="text" -->
    <!--   bind:value={variety.product} -->
    <!--   disabled -->
    <!--   class="input input-bordered w-full" -->
    <!-- /> -->
  </div>

  <div class="">
    <SelectVariety handleOnClick={updateVarietyField} />
  </div>

  <button class="btn btn-primary" type="submit" on:click={handleEditFormSubmit}>
    Confirm Edit
  </button>
</div>
