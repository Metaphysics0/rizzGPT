ALTER TABLE "conversation_messages" RENAME COLUMN "conversationId" TO "conversation_id";--> statement-breakpoint
ALTER TABLE "conversation_messages" RENAME COLUMN "messageOrder" TO "message_order";--> statement-breakpoint
ALTER TABLE "conversation_messages" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "conversations" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "conversations" RENAME COLUMN "rizzResponses" TO "rizz_responses";--> statement-breakpoint
ALTER TABLE "conversations" RENAME COLUMN "rizzResponseDescription" TO "rizz_response_description";--> statement-breakpoint
ALTER TABLE "conversations" RENAME COLUMN "initialUploadedConversationBlobUrl" TO "initial_uploaded_conversation_blob_url";--> statement-breakpoint
ALTER TABLE "conversations" RENAME COLUMN "matchContext" TO "match_context";--> statement-breakpoint
ALTER TABLE "conversations" RENAME COLUMN "matchName" TO "match_name";--> statement-breakpoint
ALTER TABLE "conversations" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "conversations" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "kindeId" TO "kinde_id";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "givenName" TO "given_name";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "familyName" TO "family_name";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_kindeId_unique";--> statement-breakpoint
ALTER TABLE "conversation_messages" DROP CONSTRAINT "conversation_messages_conversationId_conversations_id_fk";
--> statement-breakpoint
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_userId_users_id_fk";
--> statement-breakpoint
DROP INDEX "conversation_messages_conversation_id_order_idx";--> statement-breakpoint
ALTER TABLE "conversation_messages" ADD CONSTRAINT "conversation_messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "conversation_messages_conversation_id_order_idx" ON "conversation_messages" USING btree ("conversation_id","message_order");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_kinde_id_unique" UNIQUE("kinde_id");