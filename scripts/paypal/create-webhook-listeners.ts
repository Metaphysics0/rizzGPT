const { PAYPAL_CLIENT_SECRET, PUBLIC_PAYPAL_CLIENT_ID } = process.env;

const isDev = true; // Change to false for production

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface WebhookEventType {
  name: string;
}

interface CreateWebhookRequest {
  url: string;
  event_types: WebhookEventType[];
}

interface CreateWebhookResponse {
  id: string;
  url: string;
  event_types: WebhookEventType[];
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

const API_BASE_URL = isDev
  ? "https://api-m.sandbox.paypal.com/v1"
  : "https://api-m.paypal.com/v1";

// Event types needed for your webhook handler
const WEBHOOK_EVENT_TYPES: WebhookEventType[] = [
  { name: "BILLING.SUBSCRIPTION.ACTIVATED" },
  { name: "BILLING.SUBSCRIPTION.UPDATED" },
  { name: "BILLING.SUBSCRIPTION.CANCELLED" },
  { name: "BILLING.SUBSCRIPTION.EXPIRED" },
  { name: "BILLING.SUBSCRIPTION.SUSPENDED" },
  { name: "BILLING.SUBSCRIPTION.PAYMENT.FAILED" },
  { name: "PAYMENT.SALE.COMPLETED" },
];

async function getAccessToken(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/oauth2/token`, {
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
    const error = await response.text();
    throw new Error(
      `Failed to get access token: ${response.status} - ${error}`
    );
  }

  const data: PayPalAccessTokenResponse = await response.json();
  return data.access_token;
}

async function createWebhook(
  webhookUrl: string
): Promise<CreateWebhookResponse> {
  const accessToken = await getAccessToken();

  const requestBody: CreateWebhookRequest = {
    url: webhookUrl,
    event_types: WEBHOOK_EVENT_TYPES,
  };

  console.log("\nCreating webhook with the following configuration:");
  console.log(`URL: ${webhookUrl}`);
  console.log(`Event types: ${WEBHOOK_EVENT_TYPES.length}`);
  WEBHOOK_EVENT_TYPES.forEach((event) => console.log(`  - ${event.name}`));

  const response = await fetch(`${API_BASE_URL}/notifications/webhooks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to create webhook: ${response.status} - ${JSON.stringify(error)}`
    );
  }

  const webhook: CreateWebhookResponse = await response.json();
  return webhook;
}

async function listWebhooks(): Promise<void> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}/notifications/webhooks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list webhooks: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log("\nExisting webhooks:");
  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  try {
    console.log("PayPal Webhook Setup Script");
    console.log("============================");
    console.log(`Environment: ${isDev ? "SANDBOX" : "PRODUCTION"}`);

    // Get webhook URL from command line arguments
    const webhookUrl = process.argv[2];

    if (!webhookUrl) {
      console.error("\nError: Webhook URL is required");
      console.log("\nUsage:");
      console.log(
        "  bun run scripts/paypal/create-webhook-listeners.ts <webhook-url>"
      );
      console.log("\nExample:");
      console.log(
        "  bun run scripts/paypal/create-webhook-listeners.ts https://your-domain.com/api/webhooks/paypal"
      );
      console.log("\nFor local testing with localtunnel:");
      console.log(
        "  bun run scripts/paypal/create-webhook-listeners.ts https://your-tunnel.loca.lt/api/webhooks/paypal"
      );
      process.exit(1);
    }

    // Validate URL
    try {
      new URL(webhookUrl);
    } catch {
      console.error("\nError: Invalid webhook URL");
      process.exit(1);
    }

    // List existing webhooks first
    console.log("\nChecking existing webhooks...");
    await listWebhooks();

    console.log("\n-----------------------------");
    console.log("\nCreating new webhook...");

    const webhook = await createWebhook(webhookUrl);

    console.log("\n Webhook created successfully!");
    console.log("\nWebhook Details:");
    console.log(`  ID: ${webhook.id}`);
    console.log(`  URL: ${webhook.url}`);
    console.log(`\n�  IMPORTANT: Add this webhook ID to your .env file:`);
    console.log(`  PAYPAL_WEBHOOK_ID=${webhook.id}`);
    console.log("\nSubscribed event types:");
    webhook.event_types.forEach((event) => console.log(`  - ${event.name}`));
  } catch (error) {
    console.error("\nL Error:", error);
    process.exit(1);
  }
}

main();
