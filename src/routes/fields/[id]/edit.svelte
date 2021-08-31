<script context="module" lang="ts">
  import { Field } from '$lib/db';
  import { Variety } from '$lib/db';

  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ page, fetch }) => {
    const id = page.params.id;
		const field = await Field.get(id);

    // I will use the rest of each product's data to display it in a better way for the select
    // a way that shows the gdu values and brand in some kind of custom Select component
    let varieties: Variety[] = await Variety.getAllProducts();
    
    return {
			props: { varieties, field }
		};
  }

</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import SelectVariety from '$lib/components/SelectVariety.svelte';

  
  export let varieties: Variety[];
  export let field: Field;

  console.log(field);
  console.log(varieties);
  
  
  // export let varieties: Variety;
  
  let varietyValue = '';
  function updateVarietyField(variety: Variety) {
    varietyValue = variety.product;
  }

  function handleEditFormSubmit(event: FormEventHandler<HTMLFormElement>) {
    event.preventDefault();

    console.log(event);
    
    const varietyId: string = event.target.variety.value;
    const date: string = event.target.date.value;


    field.datePlanted = new Date(date);
    // get and save Variety 
    field.varietyId = varietyId;
    console.log(field.datePlanted);
    
    field.save()
      .then((value: string) => {
        console.log("edit field - successful");
        console.log(value);
        // goto('fields/' + field.id);
      })
      .catch(() => {
        console.log("edit field - field save unsuccessful");
        // Todo: show error toast or message
      });
  }
</script>

<Header backPath={'fields/' + field.id} showButton={false} />

<form on:submit={handleEditFormSubmit} class='w-5/6 mx-auto h-full flex flex-col justify-between p-8'>
  <div class='flex flex-wrap mb-14'>
    <label class='w-full'>
      <span><span class="text-purdue-metallic">*</span> Planted on</span>
      <input id='date' type="date" required />
    </label>

    <!-- <label class='w-full'>
      <span><span class="text-purdue-metallic">*</span> Variety</span> -->

      <!-- TODO: custom select to display more info about varieties -->
      <!-- <select id='variety' required>
        pre-fills defaults values (still working default value for time)
        {#each varieties as variety}
          {#if field.varietyId && variety.id === field.varietyId}
            <option value={variety.id} selected>{variety.product}</option>
          {:else}
            <option value={variety.id}>{variety.product}</option>
          {/if}
        {/each}
      </select>
    </label> -->

    <label class='w-full'>
      <span><span class="text-purdue-metallic">*</span>Selected Variety</span>
      <input id='variety' type="text" value={varietyValue} disabled />
    </label>

    <div class='w-full h-1/2 mt-3'>
      <SelectVariety handleOnClick={updateVarietyField}/>
    </div>

    <button class='mt-4' type='submit'>Confirm Edit</button>
  </div>
</form>