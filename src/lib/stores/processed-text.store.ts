import { writable } from 'svelte/store';

export const processedText = writable<string>('');
