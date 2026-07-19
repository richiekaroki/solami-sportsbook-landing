import { writable } from 'svelte/store';

/** Global search query — shared between Sidebar input and page feed */
export const searchQuery = writable('');
