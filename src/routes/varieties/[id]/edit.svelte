<script context="module" lang="ts">
	import { Variety } from '$lib/db';
	import { goto } from '$app/navigation';

	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page }) => {
		let variety = (await Variety.get(page.params.id)) || Variety.default();

		// Take product hint
		variety.product = page.query.get('product') || variety.product;

		const brands = await Variety.getBrands();

		return {
			props: { variety, brands }
		};
	};

	// This is a test
</script>

<script lang="ts">
	export let variety: Variety;
	export let brands: Array<string>;
</script>

<div class="max-w-md mx-4">
	<div class="grid grid-cols-1 gap-3">
		<!-- Brand -->
		<label>
			<span><span class="text-purdue-metallic">*</span> Brand</span>
			<input type="text" bind:value={variety.brand} list="brands" required aria-required />

			<datalist id="brands">
				{#each brands || [] as brand}
					<option>{brand}</option>
				{/each}
			</datalist>
		</label>

		<!-- Product -->
		<label>
			<span><span class="text-purdue-metallic">*</span> Product</span>
			<input type="text" bind:value={variety.product} />
		</label>

		<!-- Seed type -->
		<label>
			<span>Seed type</span>
			<select bind:value={variety.type}>
				<option>Corn</option>
			</select>
		</label>

		<!-- GDU to tassel -->
		<label>
			<span>GDU to tassel</span>
			<input type="number" bind:value={variety.gduToTassel} />
		</label>

		<!-- GDU to black -->
		<label>
			<span>GDU to black</span>
			<input type="number" bind:value={variety.gduToBlack} />
		</label>

		<label>
			<button
				type="button"
				on:click={() => {
					variety.save();
					goto('/varieties');
				}}
			>
				{#if variety.id}
					Update
				{:else}
					Create
				{/if}
			</button>
		</label>
	</div>
</div>
