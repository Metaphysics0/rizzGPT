import { EdgeFunctionEndpoints } from "$lib/constants/edge-function-endpoints.enum";
import type { GeneratedResponse, RizzGPTFormData } from "$lib/types";

export class ApiService {
  async generateRizz(
    formData: RizzGPTFormData,
    blobUrl: string
  ): Promise<GeneratedResponse> {
    const response = await fetch(EdgeFunctionEndpoints.GENERATE_RIZZ, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blobUrl, formData }),
    });
    const { data } = await response.json();

    return data;
  }
}
