import { writable, derived } from 'svelte/store';
import type { SupportedApps } from '$lib/constants/supported-apps.constant';

export const selectedApp = writable<SupportedApps | null>(null);
export const relationshipDetails = writable<{
	duration: number;
	objective: string;
	additionalNotes?: string;
}>({ duration: 0, objective: '', additionalNotes: '' });

// Derived stores for step completion
export const isStep1Complete = derived(selectedApp, ($selectedApp) => !!$selectedApp);
export const isStep2Complete = derived(relationshipDetails, ($rd) => $rd.objective !== '');

// Add new stores for video processing
export const videoProcessingState = writable<{
	progress: number;
	currentFrame: number;
	isProcessing: boolean;
}>({ progress: 0, currentFrame: 0, isProcessing: false });

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
