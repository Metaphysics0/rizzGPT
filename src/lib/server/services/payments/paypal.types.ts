export interface PaypalAccessTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface PayPalProduct {
  id: string;
  name: string;
  description: string;
  type: "PHYSICAL" | "DIGITAL" | "SERVICE";
  category?: string;
  image_url?: string;
  home_url?: string;
}

export interface PayPalBillingCycle {
  frequency: {
    interval_unit: "DAY" | "WEEK" | "MONTH" | "YEAR";
    interval_count: number;
  };
  tenure_type: "REGULAR" | "TRIAL";
  sequence: number;
  total_cycles: number;
  pricing_scheme: {
    fixed_price: {
      value: string;
      currency_code: string;
    };
  };
}

export interface PayPalPaymentPreferences {
  auto_bill_outstanding: boolean;
  setup_fee?: {
    value: string;
    currency_code: string;
  };
  setup_fee_failure_action?: "CONTINUE" | "CANCEL";
  payment_failure_threshold: number;
}

export interface PayPalPlan {
  id: string;
  product_id: string;
  name: string;
  description?: string;
  status: "CREATED" | "INACTIVE" | "ACTIVE";
  billing_cycles: PayPalBillingCycle[];
  payment_preferences: PayPalPaymentPreferences;
}

export interface PayPalSubscriber {
  name?: {
    given_name: string;
    surname: string;
  };
  email_address: string;
}

export interface PayPalSubscriptionRequest {
  plan_id: string;
  subscriber?: PayPalSubscriber;
  application_context?: {
    brand_name?: string;
    locale?: string;
    shipping_preference?:
      | "GET_FROM_FILE"
      | "NO_SHIPPING"
      | "SET_PROVIDED_ADDRESS";
    user_action?: "SUBSCRIBE_NOW" | "CONTINUE";
    payment_method?: {
      payer_selected?: "PAYPAL";
      payee_preferred?: "IMMEDIATE_PAYMENT_REQUIRED" | "UNRESTRICTED";
    };
    return_url?: string;
    cancel_url?: string;
  };
}

export interface PayPalSubscription {
  id: string;
  status:
    | "APPROVAL_PENDING"
    | "APPROVED"
    | "ACTIVE"
    | "SUSPENDED"
    | "CANCELLED"
    | "EXPIRED";
  status_update_time?: string;
  plan_id: string;
  start_time?: string;
  quantity?: string;
  subscriber?: PayPalSubscriber;
  billing_info?: {
    outstanding_balance?: {
      currency_code: string;
      value: string;
    };
    cycle_executions?: Array<{
      tenure_type: "REGULAR" | "TRIAL";
      sequence: number;
      cycles_completed: number;
      cycles_remaining?: number;
      current_pricing_scheme_version?: number;
    }>;
    last_payment?: {
      amount: {
        currency_code: string;
        value: string;
      };
      time: string;
    };
    next_billing_time?: string;
    final_payment_time?: string;
    failed_payments_count?: number;
  };
  create_time: string;
  update_time?: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PayPalWebhookEvent {
  id: string;
  event_version: string;
  create_time: string;
  resource_type: string;
  resource_version?: string;
  event_type:
    | "BILLING.SUBSCRIPTION.ACTIVATED"
    | "BILLING.SUBSCRIPTION.CANCELLED"
    | "BILLING.SUBSCRIPTION.EXPIRED"
    | "BILLING.SUBSCRIPTION.UPDATED"
    | "BILLING.SUBSCRIPTION.SUSPENDED"
    | "BILLING.SUBSCRIPTION.PAYMENT.FAILED"
    | "PAYMENT.SALE.COMPLETED";
  summary: string;
  resource: PayPalSubscription | any;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PayPalWebhookVerificationRequest {
  auth_algo: string;
  cert_url: string;
  transmission_id: string;
  transmission_sig: string;
  transmission_time: string;
  webhook_id: string;
  webhook_event: PayPalWebhookEvent;
}

export interface PayPalWebhookVerificationResponse {
  verification_status: "SUCCESS" | "FAILURE";
}

export interface PayPalReviseSubscriptionRequest {
  plan_id: string;
  quantity?: string;
  shipping_amount?: {
    currency_code: string;
    value: string;
  };
  shipping_address?: {
    name?: {
      full_name?: string;
    };
    address?: {
      address_line_1?: string;
      address_line_2?: string;
      admin_area_2?: string;
      admin_area_1?: string;
      postal_code?: string;
      country_code: string;
    };
  };
  application_context?: {
    brand_name?: string;
    locale?: string;
    shipping_preference?:
      | "GET_FROM_FILE"
      | "NO_SHIPPING"
      | "SET_PROVIDED_ADDRESS";
    user_action?: "CONTINUE";
    payment_method?: {
      payer_selected?: "PAYPAL";
      payee_preferred?: "IMMEDIATE_PAYMENT_REQUIRED";
    };
    return_url?: string;
    cancel_url?: string;
  };
}

export interface PayPalReviseSubscriptionResponse {
  plan_id: string;
  quantity: string;
  shipping_amount?: {
    currency_code: string;
    value: string;
  };
  subscriber?: PayPalSubscriber;
  plan_overridden?: boolean;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface CreateOrUpdateSubscriptionParams {
  email: string;
  provider: "paypal";
  paypalSubscriptionId: string;
  paypalPlanId: string;
  productId: string;
  productName: string;
  price: string;
  purchaserEmail: string;
  purchaserName?: string;
  isSubscription: boolean;
  status: "active" | "expired" | "cancelled";
  expiresAt?: Date;
}
