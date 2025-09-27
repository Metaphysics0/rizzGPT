import { GUMROAD_ACCESS_TOKEN, GUMROAD_PRODUCT_ID } from "$env/static/private";
import type { SubscriptionData } from "../subscription.service";
import type {
  GumroadSubscribersResponse,
  GumroadWebhookPayload,
} from "./gumroad.types";

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
      const url = this.createApiUrl(
        `products/${GUMROAD_PRODUCT_ID}/subscribers`
      );
      const response = await fetch(url);
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

  parseWebhookData(webhookData: GumroadWebhookPayload): SubscriptionData {
    const isSubscription = webhookData.is_subscription_payment === "true";
    const isCancelled =
      webhookData.cancelled === "true" || webhookData.ended === "true";

    let status: "active" | "expired" | "cancelled" = "active";
    if (isCancelled) {
      status = "cancelled";
    }

    let expiresAt: Date | undefined;
    if (isSubscription && !isCancelled) {
      expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    return {
      email: webhookData.email,
      gumroadSaleId: webhookData.sale_id,
      productId: webhookData.product_id,
      productName: webhookData.product_name,
      price: webhookData.price,
      purchaserEmail: webhookData.email,
      purchaserName: webhookData.full_name,
      isSubscription,
      subscriptionId: webhookData.subscription_id,
      status,
      expiresAt,
    };
  }

  private createApiUrl(endpoint: string) {
    const baseApiUrl = "https://api.gumroad.com/v2";
    return `${baseApiUrl}/${endpoint}?access_token=${GUMROAD_ACCESS_TOKEN}`;
  }
}
