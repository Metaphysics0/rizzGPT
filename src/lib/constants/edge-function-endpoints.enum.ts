export enum EdgeFunctionEndpoints {
  GENERATE_RIZZ = "/api/edge-functions/generate-rizz",
  TRIGGER_GENERATE_RIZZ = "/api/trigger-generate-rizz",
}

export function isEdgeFunctionEndpoint(url: string): boolean {
  const endpoint = url.split("/api/").at(-1);
  if (!endpoint) return false;

  return Object.values(EdgeFunctionEndpoints).includes(
    `/api/${endpoint}` as EdgeFunctionEndpoints
  );
}

export function getEdgeFunctionEndpointUrl(
  endpoint: EdgeFunctionEndpoints
): string {
  return `https://${window.location.hostname}${endpoint}`;
}
