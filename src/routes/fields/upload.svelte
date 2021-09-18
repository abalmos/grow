<script context="module" lang="ts">
  // TODO: Is this the right way to init this?
  import init from '$lib/geo-utils/geo-utils';
  import CheckmarkIcon from '$lib/icons/CheckmarkIcon.svelte';
  import { goto } from '$app/navigation';

  export async function load() {
    await init();

    return {};
  }
</script>

<script lang="ts">
  import { getFeaturesFromShape } from '$lib/geo-utils/geo-utils';
  import FieldCard from '$lib/FieldCard.svelte';
  import { Field } from '$lib/db';

  let fieldNameKey = '';
  let fields: Array<{ checked: boolean; field: Field }> = [];

  // Update the field properties when the user mapping changes
  $: {
    fields = fields.map((f) => {
      let properties = f.field?.geojson?.properties
        ? f.field.geojson.properties
        : {};
      Object.assign(f.field, f.field, { name: properties[fieldNameKey] });
      return f;
    });
  }

  async function handleShapefile(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.files) {
      // TODO: Support multiple file upload
      let b = await target.files[0]?.arrayBuffer();

      if (!b) {
        fields = [];
        return;
      }

      // NOTE: We have to ensure the TS `Field` and the rs return type agree!
      let shapes = getFeaturesFromShape(new Uint8Array(b)) as Field[];

      fields = shapes.map((s) => ({
        checked: false,
        field: new Field('', s.geojson, s.area, s.center)
      }));
    }
  }

  async function handleSubmit() {
    for (const field of fields) {
      if (field.checked) {
        await field.field.save();
      }
    }

    goto('/fields');
  }
</script>

<div class="m-2">
  {#if fields.length === 0}
    <label>
      <span>Upload Shapefile:</span>
      <input type="file" on:change={handleShapefile} />
    </label>
  {:else}
    <h1>One more step</h1>
    <p>I need a little help. Can you tell me which is the field name?</p>
    <label>
      <span>Field name</span>
      <select bind:value={fieldNameKey}>
        <option selected disabled hidden />
        {#each Object.keys(fields[0]?.field.geojson.properties || {}) as key}
          <option>{key}</option>
        {/each}
      </select>
    </label>

    <h1>Which fields would you like to import?</h1>

    <div class="card-grid">
      {#each fields as field}
        <label class="floating relative">
          <input
            type="checkbox"
            on:click={() => (field.checked = !field.checked)}
          />
          <CheckmarkIcon
            class="absolute w-8 h-8 inset-1.5 z-500 text-gray-100 "
            checked={field.checked}
          />
          <FieldCard field={field.field} />
        </label>
      {/each}
    </div>

    <label class="submit">
      <button type="submit" on:click={handleSubmit}>
        Import {fields.filter((f) => f.checked).length} Fields
      </button>
    </label>
  {/if}
</div>

<style type="postcss">
  label.floating input {
    @apply absolute w-full h-full opacity-0 inset-0;
  }

  label.submit {
    @apply mb-20;
  }
</style>
