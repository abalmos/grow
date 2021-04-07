<script context="module" lang="ts">
	import { Field } from '$lib/db';
	import FieldCard from '$lib/FieldCard.svelte';
</script>

<h1>Fields</h1>

<!-- TODO: Find the pattern we like best .... -->
{#await Field.getAll()}
	<!-- This is a crappy screen. The data is local, this will _always_ just flash
		quickly -->
	<p>Loading ...</p>
{:then fields}
	<div class="m-2 card-grid">
		{#each fields as field (field.id)}
			<FieldCard {field} />
		{/each}
	</div>
{/await}
