<script lang="ts">
  import { goto } from '$app/navigation';
  // import { browser } from '$app/env';
  import { Field } from '$lib/db';
  import Leaflet from '$lib/leaflet/Leaflet.svelte';
  import GeoJson from '$lib/leaflet/GeoJson.svelte';
  import Header from '$lib/components/Header.svelte';
  import geoUtilsInit, { getFeaturesFromShape } from '@grow/geo-utils';
  import geoUtilsWasm from '@grow/geo-utils/pkg/geo-utils_bg.wasm?url';

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

      // Load the wasm binary
      await geoUtilsInit(geoUtilsWasm);
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

<Header title="Upload field(s)" backPath="/fields" />

{#if fields.length === 0}
  <div class="form-control">
    <label class="input-group input-group-vertical input-group-lg">
      <span>Shapefile</span>
      <input
        id="file"
        type="file"
        on:change={handleShapefile}
        class="input input-bordered input-lg input-file"
      />
    </label>
  </div>
{:else}
  <p class="text-lg font-bold">Select field name column.</p>
  <select
    class="select select-bordered select-primary w-full max-w-xs mb-4"
    bind:value={fieldNameKey}
  >
    <option selected disabled>Select field name</option>
    {#each Object.keys(fields[0]?.field.geojson.properties || {}) as key}
      <option>{key}</option>
    {/each}
  </select>

  <p class="text-lg font-bold mb-4">Select fields to import.</p>
  {#if fieldNameKey}
    <div class="overflow-x-auto">
      <table class="table table-fixed table-zebra w-full">
        <thead>
          <tr>
            <th class="w-10" />
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
                    class="checkbox checkbox"
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

    <div class="sticky bottom-16 z-50">
      <button
        type="submit"
        class="btn btn-primary w-full"
        on:click={handleSubmit}
      >
        Import {fields.filter((f) => f.checked).length} Fields
      </button>
    </div>
  {/if}
{/if}
