<script lang="ts">
  import { goto } from '$app/navigation';
  import { Variety } from '$lib/db/Variety';

  import PollenIcon from '$lib/icons/PollenIcon.svelte';
  import CornIcon from '$lib/icons/CornIcon.svelte';
  import SearchIcon from '$lib/icons/SearchIcon.svelte';

  export let handleOnClick: (variety: Variety) => void;

  let search = '';

  let varieties: Map<string, Variety[]> = new Map();
  $: {
    // TODO: Move this group by somewhere else??
    Variety.searchByProduct(search).then((v) => {
      const g = v.reduce(
        (map, e) => map.set(e.brand, [...(map.get(e.brand) || []), e]),
        new Map()
      );
      varieties = g;
    });
  }

  function handleCreateVariety() {
    goto(`/varieties/new/edit?product=${encodeURIComponent(search)}`);
  }
</script>

<div>
  <div>
    <div class="form-control">
      <label class="input-group" for="search">
        <span>
          <SearchIcon class="h-6 w-6" />
        </span>
        <input
          bind:value={search}
          id="search"
          type="text"
          placeholder="Search varieties"
          class="input input-bordered w-full"
        />
      </label>
    </div>

    <!-- TODO: dasiyui-ify it still ... -->
    <div class="text-sm mt-3 px-2 h-60 overflow-y-scroll">
      {#each Array.from(varieties.entries()) as [brand, vs]}
        <h2 class="uppercase text-xs font-extralight tracking-wide pt-6">
          {brand}
        </h2>
        <div class="divide-y divide-gray-100">
          {#each vs as variety (variety.brand + variety.product)}
            <div
              on:click={() => {
                handleOnClick(variety);
              }}
              class="flex-col items-center cursor-pointer text-gray-700
						hover:text-blue-400 hover:bg-blue-100 rounded-sm m-2 py-1"
            >
              <div class="flex-grow text-lg">{variety.product}</div>
              <div class="flex flex-row mt-2">
                <PollenIcon class="w-4 h-4 mr-2" />
                {#if variety.gduToTassel}
                  {variety.gduToTassel}
                {:else}
                  <span class="text-red-300">Unknown</span>
                {/if}
                <CornIcon class="w-4 h-4 ml-2 mr-2" />
                {#if variety.gduToBlack}
                  {variety.gduToBlack}
                {:else}
                  <span class="text-red-300">Unknown</span>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/each}

      {#if search.length > 0}
        <button class="mt-4" on:click={handleCreateVariety}>
          <p class="font-light tracking-wide">
            create <span class="normal-case text-normal font-normal"
              >{search} ...</span
            >
          </p>
        </button>
      {/if}
    </div>
  </div>
</div>
