export enum EdgeFunctionEndpoints {
  GENERATE_RIZZ = "/api/edge-functions/generate-rizz",
  TRIGGER_GENERATE_RIZZ = "/api/trigger-generate-rizz",
}

export function getServerSideEdgeFunctionUrl(
  request: Request,
  endpoint: EdgeFunctionEndpoints
): string {
  return `https://${new URL(request.url).origin}${endpoint}`;
}
