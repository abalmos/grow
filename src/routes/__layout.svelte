<script lang="ts">
  import '../global.css';

  import MapIcon from '$lib/icons/MapIcon.svelte';
  import FieldsIcon from '$lib/icons/FieldsIcon.svelte';
  import VarietyIcon from '$lib/icons/VarietyIcon.svelte';

  import { page } from '$app/stores';
</script>

<!-- Extra padding to accoutn for the bottom nav bar height -->
<div class="pb-20 prose">
  <slot />
</div>

<div
  class="w-full fixed bottom-0 z-[500] border-t-2 border-accent border-opacity-70"
>
  <ul
    class="menu compact w-full justify-around bg-base-100 horizontal items-end"
  >
    <li>
      <a
        href="/#"
        class="flex-col gap-1 text-base-content"
        class:active={$page.path.startsWith('/#')}
      >
        <MapIcon class="h-5" />
        <div class="text-xs">Map</div>
      </a>
    </li>
    <li>
      <a
        href="/fields"
        class="flex-col gap-1 text-base-content"
        class:active={$page.path.startsWith('/fields')}
      >
        <FieldsIcon class="h-5" />
        <div class="text-xs">Fields</div>
      </a>
    </li>
    <li>
      <a
        href="/varieties"
        class="flex-col gap-1 text-base-content"
        class:active={$page.path.startsWith('/varieties')}
      >
        <VarietyIcon class="h-5" />
        <div class="text-xs">Varieties</div>
      </a>
    </li>
  </ul>
</div>

<style lang="postcss">
  .active {
    @apply text-base-200 bg-accent-focus;
  }
</style>
