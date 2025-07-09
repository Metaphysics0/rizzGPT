import { QSTASH_TOKEN } from "$env/static/private";
import type { EdgeFunctionEndpoints } from "$lib/constants/edge-function-endpoints.enum";
import { Client } from "@upstash/qstash";

// a service meant to trigger edge functions from the server
export class QstashService {
  private readonly client: Client;

  constructor() {
    if (!QSTASH_TOKEN) {
      throw new Error("QSTASH_TOKEN is not set");
    }
    this.client = new Client({ token: QSTASH_TOKEN });
  }

  async publish({
    body,
    url,
    maxRetries = 3,
  }: {
    body: any;
    url: EdgeFunctionEndpoints;
    maxRetries?: number;
  }): Promise<void> {
    await this.client.publishJSON({
      url,
      body,
      retries: maxRetries,
    });
  }
}
