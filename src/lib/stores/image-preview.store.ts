import { writable } from 'svelte/store';

// Allow null values for proper reset
export const imagePreview = writable<string | null>('');
