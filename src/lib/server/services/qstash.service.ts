import {
  QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY,
  QSTASH_TOKEN,
} from "$env/static/private";
import type { EdgeFunctionEndpoints } from "$lib/constants/edge-function-endpoints.enum";
import {
  jsonErrorResponse,
  unknownErrorResponse,
} from "$lib/server/utils/api-response.util";
import { Client, Receiver } from "@upstash/qstash";

// a service meant to trigger edge functions from the server
export class QstashService {
  private readonly client: Client;

  constructor() {
    if (!QSTASH_TOKEN) {
      throw new Error("QSTASH_TOKEN is not set");
    }
    this.client = new Client({ token: QSTASH_TOKEN });
  }

  async publish<T>({
    body,
    url,
    maxRetries = 3,
  }: {
    body: T;
    url: string;
    maxRetries?: number;
  }) {
    console.log(
      `Publishing message to QStash ${JSON.stringify({ url, body })}`
    );
    return this.client.publishJSON({
      url,
      body,
      retries: maxRetries,
    });
  }

  async validateSignatureFromRequest(request: Request): Promise<{
    isValid: boolean;
    body?: string;
    error?: Response;
  }> {
    try {
      if (!QSTASH_CURRENT_SIGNING_KEY || !QSTASH_NEXT_SIGNING_KEY) {
        return {
          isValid: false,
          error: jsonErrorResponse("QStash signing keys not configured", 500),
        };
      }

      const receiver = new Receiver({
        currentSigningKey: QSTASH_CURRENT_SIGNING_KEY,
        nextSigningKey: QSTASH_NEXT_SIGNING_KEY,
      });

      const body = await request.text();
      const signature = request.headers.get("Upstash-Signature");

      if (!signature) {
        return {
          isValid: false,
          error: jsonErrorResponse("Missing Upstash signature", 401),
        };
      }

      const isValidSignature = await receiver
        .verify({ signature, body })
        .catch(() => false);

      if (!isValidSignature) {
        return {
          isValid: false,
          error: jsonErrorResponse("Invalid Upstash signature", 401),
        };
      }

      return { isValid: true, body };
    } catch (error) {
      console.error("Upstash signature validation error:", error);
      return {
        isValid: false,
        error: unknownErrorResponse(error, "Signature validation failed"),
      };
    }
  }
}
