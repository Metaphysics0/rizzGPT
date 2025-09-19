import type { ConversationsListItem, ConversationStatus } from "$lib/types";
import { desc, eq } from "drizzle-orm";
import { db } from "../database/connection";
import { conversations } from "../database/schema";
import type { Conversation, NewConversation } from "../database/types";

class DatabaseService {
  async createConversation(
    conversationData: NewConversation
  ): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversations)
      .values(conversationData)
      .returning();

    return newConversation;
  }

  async getConversationsForUser(
    userId: string
  ): Promise<ConversationsListItem[]> {
    return db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.createdAt))
      .limit(100);
  }

  async getConversationById(
    conversationId: string
  ): Promise<Conversation | null> {
    const result = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
      .limit(1);

    return result[0] || null;
  }

  async updateConversation(
    conversationId: string,
    updates: Partial<Omit<NewConversation, "id" | "createdAt">>
  ): Promise<Conversation | null> {
    const [updatedConversation] = await db
      .update(conversations)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, conversationId))
      .returning();

    return updatedConversation || null;
  }

  async deleteConversation(conversationId: string): Promise<boolean> {
    const result = await db
      .delete(conversations)
      .where(eq(conversations.id, conversationId))
      .returning();

    return result.length > 0;
  }

  async updateConversationStatus(
    conversationId: string,
    status: ConversationStatus
  ): Promise<Conversation | null> {
    return await this.updateConversation(conversationId, { status });
  }
}

export const databaseService = new DatabaseService();
