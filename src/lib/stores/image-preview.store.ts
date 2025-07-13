import { writable } from "svelte/store";

export const imagePreview = writable<string | null>("");
