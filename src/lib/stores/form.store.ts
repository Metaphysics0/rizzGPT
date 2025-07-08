import type { SupportedApps } from "$lib/constants/supported-apps.constant";
import type { GeneratedResponse } from "$lib/types";
import { writable } from "svelte/store";

export const relationshipDetails = writable<{
  duration: number;
  objective: string;
  additionalNotes?: string;
}>({ duration: 0, objective: "", additionalNotes: "" });

export const uploadedFile = writable<File | null>(null);

export const selectedApp = writable<SupportedApps | undefined>(undefined);

export const isGeneratingResponse = writable<boolean>(false);
export const generatedResponse = writable<GeneratedResponse | null>(null);
export const responseError = writable<string | null>(null);

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
