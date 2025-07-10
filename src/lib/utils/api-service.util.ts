import {
  EdgeFunctionEndpoints,
  getEdgeFunctionEndpointUrl,
} from "$lib/constants/edge-function-endpoints.enum";
import type { GeneratedResponse, RizzGPTFormData } from "$lib/types";

export class ApiService {
  async generateRizz(
    formData: RizzGPTFormData,
    blobUrl: string
  ): Promise<GeneratedResponse> {
    const response = await fetch(EdgeFunctionEndpoints.TRIGGER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageBody: { blobUrl, formData },
        url: getEdgeFunctionEndpointUrl(EdgeFunctionEndpoints.GENERATE_RIZZ),
      }),
    });
    const { data } = await response.json();

    return data;
  }
}
