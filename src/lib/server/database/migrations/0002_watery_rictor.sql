ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_lemon_squeezy_id_unique";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "lemon_squeezy_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "lemon_squeezy_customer_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "lemon_squeezy_order_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "lemon_squeezy_product_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "lemon_squeezy_variant_id";