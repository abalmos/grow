<script lang="ts">
	let clazz = '';
	export { clazz as class };
	export let checked = false;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 847 847"
	fill-rule="evenodd"
	class:checked
	class={clazz}
>
	<path
		d="M423 19c223 0 404 181 404 404S646 827 423 827 19 646 19 423 200 19 423 19zm-75 459l260-260 75 76-335 334-184-184 75-76 109 110z"
	/>
</svg>

<style type="postcss">
	svg {
		@apply text-opacity-50 hover:text-opacity-75 fill-current;
	}
	.checked {
		@apply text-opacity-100;
	}
</style>
