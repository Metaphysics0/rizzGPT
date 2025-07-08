import type { SupportedApps } from "$lib/constants/supported-apps.constant";
import type { GeneratedResponse } from "$lib/types";
import { derived, writable } from "svelte/store";

export const selectedApp = writable<SupportedApps | null>(
  "other" as SupportedApps
);
export const relationshipDetails = writable<{
  duration: number;
  objective: string;
  additionalNotes?: string;
}>({ duration: 0, objective: "", additionalNotes: "" });

export const uploadedFile = writable<File | null>(null);

export const isStep1Complete = derived(
  uploadedFile,
  ($uploadedFile) => !!$uploadedFile
);
export const isStep2Complete = writable<boolean>(true);

export const isGeneratingResponse = writable<boolean>(false);
export const generatedResponse = writable<GeneratedResponse | null>(null);
export const responseError = writable<string | null>(null);

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
