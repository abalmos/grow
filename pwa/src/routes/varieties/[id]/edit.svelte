<script context="module" lang="ts">
  import { Variety } from '$lib/db';
  import { goto } from '$app/navigation';

  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ page }) => {
    // TODO: Convert this so `.get()` returns the default for undefined id?
    let variety =
      (await Variety.get(page.params['id'] || '')) || Variety.default();

    // Take product hint
    variety.product = page.query.get('product') || variety.product;

    const brands = await Variety.getBrands();

    return {
      props: { variety, brands }
    };
  };
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';

  export let variety: Variety;
  export let brands: Array<string>;
</script>

<Header title={`Edit: ${variety.product}`} backPath="/varieties" />

<div class="flex flex-col gap-2 px-2">
  <!-- Seed type -->
  <p>Seed type</p>
  <div class="btn-group">
    <button
      class="btn"
      class:btn-active={variety.type === 'corn'}
      on:click={() => (variety.type = 'corn')}>Corn</button
    >
    <button
      class="btn"
      class:btn-active={variety.type === 'wheat'}
      on:click={() => (variety.type = 'wheat')}>Wheat</button
    >
  </div>

  <!-- Brand -->
  <div class="form-control">
    <label class="label" for="brand">
      <span class="label-text">Brand</span>
    </label>
    <input
      id="brand"
      type="text"
      bind:value={variety.brand}
      list="brands"
      required
      aria-required
      class="input input-bordered"
    />
    <datalist id="brands">
      {#each brands || [] as brand}
        <option>{brand}</option>
      {/each}
    </datalist>
  </div>

  <!-- Product -->
  <div class="form-control">
    <label class="label" for="product">
      <span class="label-text">Product</span>
    </label>
    <input
      id="product"
      type="text"
      bind:value={variety.product}
      required
      aria-required
      class="input input-bordered w-full"
    />
  </div>

  <!-- GDU to tassel -->
  <div class="form-control">
    <label class="label" for="tassel">
      <span class="label-text">Growth to tassel</span>
    </label>
    <label class="input-group">
      <input
        id="tassel"
        type="number"
        bind:value={variety.gduToTassel}
        class="input input-bordered w-full"
      />
      <span class="label-text">GDU</span>
    </label>
  </div>

  <!-- GDU to black -->
  <div class="form-control">
    <label class="label" for="black">
      <span class="label-text">Growth to black layer</span>
    </label>
    <label class="input-group">
      <input
        id="black"
        type="number"
        bind:value={variety.gduToBlack}
        class="input input-bordered w-full"
      />
      <span class="label-text">GDU</span>
    </label>
  </div>

  <button
    class="btn btn-primary"
    on:click={() => {
      // TODO: Catch and deal with errors!
      variety.save();
      goto('/varieties');
    }}
  >
    {#if variety.id}
      Update
    {:else}
      Create
    {/if}
  </button>
</div>
