<div
  class="modal absolute w-full h-full top-0 left-0 flex items-center justify-center"
>
  <div
    on:click
    class="absolute w-full h-full bg-black opacity-25 top-0 left-0 cursor-pointer"
  />
  <div class="absolute w-2/3 h-3/5 bg-white rounded shadow-lg">
    <slot />
  </div>
</div>

<style>
  /* To temporarily fix the map being on top of modal  */
  .modal {
    z-index: 500;
  }
</style>
