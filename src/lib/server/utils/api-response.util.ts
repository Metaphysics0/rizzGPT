import { json } from "@sveltejs/kit";

export function jsonSuccessResponse(data: any): Response {
  return json({ success: true, data });
}

export function unknownErrorResponse(
  error: unknown,
  fallbackMessage?: string
): Response {
  const errorMessage =
    error instanceof Error
      ? error.message
      : fallbackMessage || "An unexpected error occurred";

  return json({ success: false, error: errorMessage }, { status: 500 });
}

export function userIsNotFoundErrorResponse(
  fallbackMessage?: string
): Response {
  return json(
    { success: false, error: fallbackMessage || "User not found" },
    { status: 401 }
  );
}

export function unprocessableEntityResponse(
  fallbackMessage?: string
): Response {
  return json(
    { success: false, error: fallbackMessage || "Unprocessable entity" },
    { status: 422 }
  );
}
