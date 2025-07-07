import type { GeneratedResponse, RizzGPTFormData } from "$lib/types";

export const api = {
  async generateRizz(formData: RizzGPTFormData, file: File) {
    const data = new FormData();
    data.append("formData", JSON.stringify(formData));
    data.append("file", file);

    const response = await fetch("/api/generate-rizz", {
      method: "POST",
      body: data,
    });
    return response.json() as Promise<GeneratedResponse>;
  },
};
