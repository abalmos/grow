/*
import { writable } from 'svelte/store';
import { liveQuery } from 'dexie';
*/
import type { IndexableTypeArray } from 'dexie';
import { nanoid } from 'nanoid/non-secure';
import { db } from './db';

export class Variety {
	id = `v_${nanoid()}`;
	type: 'Corn';
	brand: string;
	product: string;
	gduToBlack?: number;
	gduToTassel?: number;

	constructor(
		type: 'Corn',
		brand: string,
		product: string,
		gduToBlack?: number,
		gduToTassel?: number
	) {
		this.type = type;
		this.brand = brand;
		this.product = product;
		this.gduToBlack = gduToBlack;
		this.gduToTassel = gduToTassel;
	}

	save(): Promise<string> {
		// TODO: We should throw something better. Maybe our own error types?
		//  A TS version of:
		// {
		//    field: 'brand',
		//    error: 'Brand is required',
		//    human_error: 'This field is required. Please enter a brand.'
		//  }
		if (!this.brand) {
			throw 'Brand is required';
		}

		if (!this.product) {
			throw 'Product is required';
		}

		return db.varieties.put(this);
	}

	static default(): Variety {
		return new Variety('Corn', '', '');
	}

	static get(id: string): Promise<Variety | undefined> {
		return db.varieties.get({ id });
	}

	static async getBrands(): Promise<IndexableTypeArray> {
		return db.varieties.orderBy('brand').uniqueKeys();
	}

	static getByProduct(product: string): Promise<Variety | undefined> {
		return db.varieties.get({ product });
	}

	static searchByProduct(product: string): Promise<Variety[]> {
		const lProduct = product.toLowerCase();
		return db.varieties
			.filter((v) => {
				return v.product.toLowerCase().includes(lProduct);
			})
			.toArray();
	}

  static getAllProducts(): Promise<Variety[]> {
    return db.varieties.toArray();
  }
}

db.varieties.mapToClass(Variety);

/*
type AV = Variety[];

// Expose Dexie liveQuery to Sevlte (where a default value is needed)
export function varietyStore(name: string) {
	const { subscribe, set } = writable<AV>([]);

	let sub = liveQuery(() =>
		db.varieties.where('name').startsWithIgnoreCase(name).toArray()
	).subscribe(set);

	return {
		subscribe: (run: (value: AV) => void, invalidate?: (value?: AV) => void) => {
			const unsubscribe = subscribe(run, invalidate);

			return () => {
				sub.unsubscribe();
				unsubscribe();
			};
		},
		filterByName: (name: string) => {
			sub.unsubscribe();
			sub = liveQuery(() =>
				db.varieties.where('name').startsWithIgnoreCase(name).toArray()
			).subscribe(set);
		}
	};
}
*/
