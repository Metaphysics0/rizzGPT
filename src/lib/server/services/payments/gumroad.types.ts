export interface GumroadSubscribersResponse {
  success: boolean;
  subscribers: GumroadSubscriber[];
}

export interface GumroadSubscriber {
  id: string;
  email: string;
  product_id: string;
  product_name: string;
  user_id: any;
  user_email: any;
  purchase_ids: string[];
  created_at: string;
  user_requested_cancellation_at?: string;
  charge_occurrence_count: any;
  recurrence: string;
  cancelled_at?: string;
  ended_at: any;
  failed_at: any;
  free_trial_ends_at: any;
  status: string;
}

export interface GumroadWebhookPayload {
  sale_id: string;
  product_id: string;
  product_name: string;
  price: string;
  email: string;
  full_name?: string;
  purchaser_id: string;
  subscription_id?: string;
  is_subscription_payment?: string;
  is_renewal?: string;
  cancelled?: string;
  ended?: string;
  test?: boolean;
}
