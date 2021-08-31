<script lang="ts">
	// import BackArrow from '$lib/icons/BackArrow.svelte';
	// import NewIcon from '$lib/icons/NewIcon.svelte';
  // import Modal from '$lib/components/Modal.svelte';


	// import { goto } from '$app/navigation';

	// function handleBack() {
	// 	goto('/fields');
	// }

  // let showEditModal: boolean = false;
  // const toggleEditModal: () => void = () => {
  //   showEditModal = !showEditModal;
  // }
</script>

<!-- <header class="sticky top-0 bg-purdue-gray shadow">
	<div class="flex justify-left items-center p-4">
		<BackArrow on:click={handleBack} class="text-white w-6 h-6 mr-2" />
		<div class="flex justify-between w-full">
			<p class="block text-white font-semibold">Fields</p>
			TODO: Make this an edit icon
			<NewIcon on:click={toggleEditModal} class="w-6 h-6 fill-current text-white" />
		</div>
	</div>
</header> -->

<!-- {#if showEditModal}
  <Modal on:click={toggleEditModal}>
    <form class='w-full h-full flex flex-col justify-between p-8'>
      <div class='flex flex-wrap'>
        <label class='w-full'>
          <span><span class="text-purdue-metallic">*</span> Variety</span>
          <select>
            <option>variety 1</option>
            <option>variety 2</option>
            <option>variety 3</option>
          </select>
        </label>
        <label class='w-full'>
          <span><span class="text-purdue-metallic">*</span> Number of plants</span>
          <input type="number" required/>
        </label>
        <label class='w-full'>
          <span><span class="text-purdue-metallic">*</span> Planted on</span>
          <input type="date" />
        </label>
        <label class='w-full'>
          <span><span class="text-purdue-metallic">*</span> Variety</span>
          <select>
            <option>variety 1</option>
            <option>variety 2</option>
            <option>variety 3</option>
          </select>
        </label>
      </div>
      <button type='submit'>Confirm Edit</button>
    </form>
  </Modal>
{/if} -->


<slot />
