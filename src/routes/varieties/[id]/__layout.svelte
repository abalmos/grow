<script lang="ts">
  import BackArrow from '$lib/icons/BackArrow.svelte';
  import NewIcon from '$lib/icons/NewIcon.svelte';

  import { goto } from '$app/navigation';
</script>

<header class="sticky top-0 bg-purdue-gray shadow">
  <div class="flex justify-left items-center p-4">
    <BackArrow
      on:click={() => goto('/varieties')}
      class="text-white w-6 h-6 mr-2"
    />
    <div class="flex justify-between w-full">
      <p class="block text-white font-semibold">Varieties</p>
      <NewIcon class="w-6 h-6 fill-current text-white" />
    </div>
  </div>
</header>

<slot />
