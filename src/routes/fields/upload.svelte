<script context="module" lang="ts">
  // TODO: Is this the right way to init this?
  import init from '$lib/geo-utils/geo-utils';
  // import CheckmarkIcon from '$lib/icons/CheckmarkIcon.svelte';
  import { goto } from '$app/navigation';

  export async function load() {
    await init();

    return {};
  }
</script>

<script lang="ts">
  import { getFeaturesFromShape } from '$lib/geo-utils/geo-utils';
  import FieldCard from '$lib/components/FieldCard.svelte';
  import { Field } from '$lib/db';
  import Leaflet from '$lib/leaflet/Leaflet.svelte';
  import GeoJson from '$lib/leaflet/GeoJson.svelte';

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
    <span>Field name</span>
    <select
      class="select selected-bordered select-error w-full max-w-xs"
      bind:value={fieldNameKey}
    >
      <option selected disabled>Select field name</option>
      {#each Object.keys(fields[0]?.field.geojson.properties || {}) as key}
        <option>{key}</option>
      {/each}
    </select>

    <h1>Which fields would you like to import?</h1>

    <div class="overflow-x-auto">
      <table class="table table-fixed table-zebra w-full">
        <thead>
          <tr>
            <th class="w-16" />
            <th class="w-24 text-center">Field</th>
            <th class="w-auto">Name</th>
          </tr>
        </thead>
        <tbody>
          {#each fields as field}
            <tr
              class:active={field.checked}
              on:click={() => (field.checked = !field.checked)}
            >
              <th>
                <label>
                  <input
                    type="checkbox"
                    class="checkbox checkbox-lg"
                    checked={field.checked}
                  />
                </label>
              </th>
              <td>
                <div class="flex items-left space-x-3">
                  <div class="avatar">
                    <div class="w-16 h-16 mask mask-squircle">
                      <Leaflet
                        class="h-full"
                        zoomControl={false}
                        dragable={false}
                        zoomable={false}
                      >
                        <GeoJson geojson={field.field.geojson} zoomTo={true} />
                      </Leaflet>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                {#if field.field.name}
                  <strong>
                    {field.field.name}
                  </strong>
                {:else}
                  <i>Please select name field above...</i>
                {/if}
                <div class="text-sm opacity-50">
                  {field.field.area.toFixed(1)} ac.
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="relative w-full h-32">
      <div class="absolute inset-x-16 bottom-0">
        <label class="submit ">
          <button type="submit" on:click={handleSubmit}>
            Import {fields.filter((f) => f.checked).length} Fields
          </button>
        </label>
      </div>
    </div>
  {/if}
</div>
