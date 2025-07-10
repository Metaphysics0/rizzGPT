import type { GeneratedResponse, RizzGPTFormData } from "$lib/types";
import { writable } from "svelte/store";

export const relationshipDetails = writable<RizzGPTFormData>({
  duration: 0,
  objective: "",
  notes: "",
});

export const uploadedFile = writable<File | null>(null);

export const isGeneratingResponse = writable<boolean>(false);
export const generatedResponse = writable<GeneratedResponse | null>(null);
export const responseError = writable<string | null>(null);

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
