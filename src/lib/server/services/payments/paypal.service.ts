import { PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID } from "$env/static/private";
import { PUBLIC_PAYPAL_CLIENT_ID } from "$env/static/public";
import type {
  PaypalAccessTokenResponse,
  PayPalProduct,
  PayPalPlan,
  PayPalSubscription,
  PayPalSubscriptionRequest,
  PayPalWebhookEvent,
  PayPalWebhookVerificationRequest,
  PayPalWebhookVerificationResponse,
} from "./paypal.types";

export class PaypalService {
  private readonly webhookId: string;
  private readonly apiBaseUrl: string;

  constructor() {
    console.log(
      "env vars",
      JSON.stringify({
        PAYPAL_CLIENT_SECRET,
        PAYPAL_WEBHOOK_ID,
        PUBLIC_PAYPAL_CLIENT_ID,
      })
    );
    if (!PUBLIC_PAYPAL_CLIENT_ID) {
      throw new Error("[PaypalService] Missing Client Id");
    }

    if (!PAYPAL_CLIENT_SECRET) {
      throw new Error("[PaypalService] Missing Client Secret");
    }

    this.webhookId = PAYPAL_WEBHOOK_ID || "";

    const isDev = process.env.NODE_ENV === "dev";
    this.apiBaseUrl = isDev
      ? `https://api-m.sandbox.paypal.com/v1`
      : `https://api-m.paypal.com/v1`;
  }

  async createProduct(
    name: string,
    description: string,
    type: "PHYSICAL" | "DIGITAL" | "SERVICE" = "SERVICE",
    category?: string
  ): Promise<PayPalProduct> {
    return this.makeRequest<PayPalProduct>("/catalogs/products", "POST", {
      name,
      description,
      type,
      category,
    });
  }

  async createPlan(planData: Partial<PayPalPlan>): Promise<PayPalPlan> {
    return this.makeRequest<PayPalPlan>("/billing/plans", "POST", planData);
  }

  async getPlan(planId: string): Promise<PayPalPlan> {
    return this.makeRequest<PayPalPlan>(`/billing/plans/${planId}`);
  }

  async createSubscription(params: {
    planId: string;
    email: string;
    name: string;
    returnUrl: string;
    cancelUrl: string;
  }): Promise<PayPalSubscription> {
    const subscriptionData: PayPalSubscriptionRequest = {
      plan_id: params.planId,
      subscriber: {
        email_address: params.email,
        name: params.name
          ? {
              given_name: params.name.split(" ")[0] || params.name,
              surname: params.name.split(" ").slice(1).join(" ") || "",
            }
          : undefined,
      },
      application_context: {
        brand_name: "RizzGPT",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      },
    };

    return this.makeRequest<PayPalSubscription>(
      "/billing/subscriptions",
      "POST",
      subscriptionData
    );
  }

  async getSubscription(subscriptionId: string): Promise<PayPalSubscription> {
    return this.makeRequest<PayPalSubscription>(
      `/billing/subscriptions/${subscriptionId}`
    );
  }

  async cancelSubscription(
    subscriptionId: string,
    reason?: string
  ): Promise<void> {
    await this.makeRequest<void>(
      `/billing/subscriptions/${subscriptionId}/cancel`,
      "POST",
      { reason: reason || "User requested cancellation" }
    );
  }

  async suspendSubscription(
    subscriptionId: string,
    reason?: string
  ): Promise<void> {
    await this.makeRequest<void>(
      `/billing/subscriptions/${subscriptionId}/suspend`,
      "POST",
      { reason: reason || "Subscription suspended" }
    );
  }

  async activateSubscription(
    subscriptionId: string,
    reason?: string
  ): Promise<void> {
    await this.makeRequest<void>(
      `/billing/subscriptions/${subscriptionId}/activate`,
      "POST",
      { reason: reason || "Subscription reactivated" }
    );
  }

  async verifyWebhookSignature(
    headers: {
      "paypal-transmission-id": string;
      "paypal-transmission-time": string;
      "paypal-transmission-sig": string;
      "paypal-cert-url": string;
      "paypal-auth-algo": string;
    },
    webhookEvent: PayPalWebhookEvent
  ): Promise<boolean> {
    if (!this.webhookId) {
      console.warn(
        "[PaypalService] Webhook ID not configured, skipping verification"
      );
      return true; // In dev, you might want to skip verification
    }

    const verificationRequest: PayPalWebhookVerificationRequest = {
      auth_algo: headers["paypal-auth-algo"],
      cert_url: headers["paypal-cert-url"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: this.webhookId,
      webhook_event: webhookEvent,
    };

    try {
      const result = await this.makeRequest<PayPalWebhookVerificationResponse>(
        "/notifications/verify-webhook-signature",
        "POST",
        verificationRequest
      );
      return result.verification_status === "SUCCESS";
    } catch (error) {
      console.error("[PaypalService] Webhook verification failed:", error);
      return false;
    }
  }

  getApprovalUrl(subscription: PayPalSubscription) {
    const approveLink = subscription.links.find(
      (link) => link.rel === "approve"
    );
    return approveLink?.href;
  }

  private async getAccessToken(): Promise<string> {
    try {
      console.log("API BASE URL", this.apiBaseUrl);

      const response = await fetch(`${this.apiBaseUrl}/oauth2/token`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${PUBLIC_PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: PaypalAccessTokenResponse = await response.json();
      return data.access_token;
    } catch (error) {
      console.error(`[PaypalService] Get access token failed:`, error);
      throw new Error("[PaypalService] Get Access Token Failed");
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    method: string = "GET",
    body?: any
  ): Promise<T> {
    const accessToken = await this.getAccessToken();
    const url = `${this.apiBaseUrl}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[PaypalService] API error:`, errorData);
        throw new Error(
          `PayPal API error: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`[PaypalService] Request failed for ${endpoint}:`, error);
      throw error;
    }
  }
}
