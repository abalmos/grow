<script lang="ts">
  import BackArrow from '$lib/icons/BackArrow.svelte';
	import NewIcon from '$lib/icons/NewIcon.svelte';

  import { goto } from '$app/navigation';

  export let handleButtonClick = () => {};
  export let showButton: boolean = true;
  export let backPath: string;

  function handleBack() {
		goto(backPath);
	}
</script>

<header class="sticky top-0 bg-purdue-gray shadow">
	<div class="flex justify-left items-center p-4">
		<BackArrow on:click={handleBack} class="text-white w-6 h-6 mr-2" />
		<div class="flex justify-between w-full">
			<p class="block text-white font-semibold">Fields</p>
			<!-- TODO: Make this an edit icon or take in icon component as prop to reuse it elsewhere -->
      {#if showButton}
        <NewIcon on:click={handleButtonClick} class="w-6 h-6 fill-current text-white" />
      {/if}
		</div>
	</div>
</header>