<script lang="ts">
	import { db, Variety } from '$lib/db';

	//db.delete();

	// TODO: How to get default data into the app?
	let v = new Variety('corn', 'Dekalb', 'DKC62-53RIB', 2810, 1305);
	db.varieties.put(v);

	v = new Variety('corn', 'Dekalb', 'DKC31-10RIB', 2025, 1061);
	db.varieties.put(v);

	v = new Variety('corn', 'Dekalb', 'DKC31-07', 2025, 1061);
	db.varieties.put(v);

	v = new Variety('corn', 'Dekalb', 'DKC69-98', 2970, 1400);
	db.varieties.put(v);

	v = new Variety('corn', 'Pioneer', 'P1197AM', 2730, 1400);
	db.varieties.put(v);
</script>
