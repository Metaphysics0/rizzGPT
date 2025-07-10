export enum EdgeFunctionEndpoints {
  GENERATE_RIZZ = "/api/edge-functions/generate-rizz",
}

export function isEdgeFunctionEndpoint(url: string): boolean {
  return Object.values(EdgeFunctionEndpoints).includes(
    url as EdgeFunctionEndpoints
  );
}
