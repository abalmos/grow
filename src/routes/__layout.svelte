<script>
  import 'virtual:windi.css';
  import '../global.css';

  import MapIcon from '$lib/icons/MapIcon.svelte';
  import FieldsIcon from '$lib/icons/FieldsIcon.svelte';
  import SettingsIcon from '$lib/icons/SettingsIcon.svelte';
</script>

<div>
  <slot />
</div>

<div class="nav-bar">
  <nav>
    <a
      href="/#"
      class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
    >
      <MapIcon />
      <span>Map</span>
    </a>
    <a
      href="/fields"
      class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
    >
      <FieldsIcon />
      <span>Fields</span>
    </a>
    <a
      href="/varieties"
      class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
    >
      <SettingsIcon />
      <span>Varieties</span>
    </a>
  </nav>
</div>

<style>
  .nav-bar {
    @apply w-full h-full;

    & nav {
      @apply block fixed inset-x-0 bottom-0 z-10 bg-white shadow  ring-1 ring-black ring-opacity-5 flex justify-between;

      z-index: 500;

      & span {
        @apply block text-sm;
      }
    }
  }
</style>
