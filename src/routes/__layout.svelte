<script lang="ts">
  import '../global.css';

  import MapIcon from '$lib/icons/MapIcon.svelte';
  import FieldsIcon from '$lib/icons/FieldsIcon.svelte';
  import SettingsIcon from '$lib/icons/SettingsIcon.svelte';
</script>

<div class="grid grid-cols-1">
  <div>
    <slot />
  </div>

  <nav class="w-full fixed bottom-0 z-[500] border-t-2">
    <ul class="menu compact w-full justify-around bg-base-100 horizontal">
      <li class="bordered bg-base-200 rounded-full px-5">
        <a href="/#" class="flex-col">
          <MapIcon />
          Map
        </a>
      </li>
      <li>
        <a href="/fields" class="flex-col">
          <FieldsIcon />
          Fields
        </a>
      </li>
      <li>
        <a href="/varieties" class="flex-col">
          <SettingsIcon />
          Varieties
        </a>
      </li>
    </ul>
  </nav>
</div>
