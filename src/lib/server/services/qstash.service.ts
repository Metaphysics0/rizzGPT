import { Client } from "@upstash/qstash";

export class QStashService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      token: process.env.QSTASH_TOKEN,
    });
  }

  async publishJson<MessageBody = unknown>(message: MessageBody) {
    await this.client.publishJSON<MessageBody>({
      url: "/api/qstash/webhook",
      body: message,
    });
  }
}
