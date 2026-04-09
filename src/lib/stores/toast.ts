import { writable } from 'svelte/store';

export interface Toast {
	id:   number;
	msg:  string;
	type: 'add' | 'remove' | 'success' | 'info';
}

let _id = 0;

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function show(msg: string, type: Toast['type'] = 'info', duration = 2500) {
		const id = ++_id;
		update((t) => [...t, { id, msg, type }]);
		setTimeout(() => {
			update((t) => t.filter((toast) => toast.id !== id));
		}, duration);
	}

	return { subscribe, show };
}

export const toasts = createToastStore();
