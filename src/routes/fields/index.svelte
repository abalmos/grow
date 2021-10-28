<script context="module" lang="ts">
  import { Field } from '$lib/db';
  import FieldCard from '$lib/components/FieldCard.svelte';
</script>

<!--
<header class="sticky top-0 bg-purdue-gray shadow z-500">
  <h1 class="p-3 text-white font-semibold">Fields</h1>
</header>
-->

<!-- TODO: Find the pattern we like best .... -->
{#await Field.getAll()}
  <!-- Fetching from IndexedDB -->
{:then fields}
  <div class="navbar bg-base-300 mb-2">
    <div class="flex-1 px-2">
      <span class="text-lg font-bold">Fields</span>
    </div>
    <div class="flex justify-end flex-1 px-2">
      <div class="flex items-stretch">
        <div class="form-control">
          <input
            type="text"
            placeholder="Search"
            class="input input-ghost input-bordered"
          />
        </div>
      </div>
      <div class="dropdown dropdown-end">
        <div tabindex="0" class="btn btn-ghost rounded-btn">Sort</div>
        <ul
          tabindex="0"
          class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 !z-[500]"
        >
          <li>
            <a>Name</a>
          </li>
          <li>
            <a>GDU</a>
          </li>
          <li>
            <a>Rain</a>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="flex flex-col">
    {#each fields as field (field.id)}
      <FieldCard {field} />
      <div class="divider w-11/12 place-self-center" />
    {/each}
  </div>
{/await}
