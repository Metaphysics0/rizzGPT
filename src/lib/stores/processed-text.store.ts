import { writable } from 'svelte/store';

export const processedText = writable<string>('');
export const processedTextIsLoading = writable<boolean>(false);
