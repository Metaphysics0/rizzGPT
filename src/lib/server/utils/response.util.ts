import { json } from "@sveltejs/kit";

export function jsonSuccessResponse(data: unknown, status = 200) {
  return json({ success: true, data }, { status });
}

export function messageAcceptedResponse(message: string) {
  return json({ success: true, message }, { status: 202 });
}

export function jsonErrorResponse(message: string, status = 400) {
  return json({ success: false, error: message }, { status });
}

export function unknownErrorResponse(
  error: unknown,
  message = "An error occurred"
) {
  console.error("Error details:", error);
  return json(
    {
      success: false,
      error: message,
      details: error instanceof Error ? error.message : "Unknown error",
    },
    { status: 500 }
  );
}

export function unprocessableEntityResponse(message: string) {
  return json({ success: false, error: message }, { status: 422 });
}

export function missingRequiredParametersErrorResponse(
  missingParameters: string[]
) {
  return unprocessableEntityResponse(
    `Missing required parameters: ${missingParameters.join(", ")}`
  );
}

export function unauthorizedResponse(message: string) {
  return json({ success: false, error: message }, { status: 401 });
}
