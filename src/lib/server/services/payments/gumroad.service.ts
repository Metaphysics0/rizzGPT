import { GUMROAD_ACCESS_TOKEN, GUMROAD_PRODUCT_ID } from "$env/static/private";
import type { GumroadSubscribersResponse } from "./gumroad.types";

export class GumroadService {
  constructor() {
    if (!GUMROAD_ACCESS_TOKEN) {
      throw new Error("[GumroadService] Missing access token");
    }
    if (!GUMROAD_PRODUCT_ID) {
      throw new Error("[GumroadService] Missing product id");
    }
  }

  async getAllActiveSubscribers(): Promise<GumroadSubscribersResponse> {
    try {
      const endpoint = this.createEndpoint(
        `products/${GUMROAD_PRODUCT_ID}/subscribers`
      );
      const response = await fetch(endpoint);
      const data = await response.json();
      if (!data || !data.success) {
        throw new Error("Subscribers response failed");
      }
      return data as GumroadSubscribersResponse;
    } catch (error) {
      console.error(`Gumroad service failed ${error}`);
      return { success: false, subscribers: [] };
    }
  }

  private createEndpoint(endpoint: string) {
    const baseUrl = "https://api.gumroad.com/v2";
    return `${baseUrl}/${endpoint}?access_token=${GUMROAD_ACCESS_TOKEN}`;
  }
}
