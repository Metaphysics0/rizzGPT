import { json } from "@sveltejs/kit";

export function unknownErrorResponse(
  error: unknown,
  fallbackMessage?: string
): Response {
  return json(
    {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : fallbackMessage || "An unexpected error occurred",
    },
    { status: 500 }
  );
}

export function userIsNotFoundErrorResponse(
  fallbackMessage?: string
): Response {
  return json(
    {
      success: false,
      error: fallbackMessage || "User not found",
    },
    { status: 401 }
  );
}
