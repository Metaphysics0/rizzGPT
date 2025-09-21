import type { GeneratedResponse, RelationshipContext } from "$lib/types";
import { writable } from "svelte/store";

export interface GenerateRizzForm {
  relationshipContext: RelationshipContext;
  blobUrl: string;
}

export const generateRizzForm = writable<GenerateRizzForm>({
  relationshipContext: {
    duration: 0,
    objective: "",
    notes: "",
  },
  blobUrl: "",
});

export const isGeneratingResponse = writable<boolean>(false);
export const generatedResponse = writable<GeneratedResponse | null>(null);
export const responseError = writable<string | null>(null);
