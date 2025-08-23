import type { ConversationsListItem } from "$lib/types";
import { desc, eq } from "drizzle-orm";
import { db } from "../database/connection";
import { conversations } from "../database/schema";
import type { Conversation, NewConversation } from "../database/types";

export class DatabaseService {
  async createConversation(
    conversationData: Omit<NewConversation, "id" | "createdAt" | "updatedAt">
  ): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversations)
      .values(conversationData)
      .returning();

    return newConversation;
  }

  async getConversationsForUser(limit = 100): Promise<ConversationsListItem[]> {
    return db
      .select({
        id: conversations.id,
        matchName: conversations.matchName,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        rizzResponseDescription: conversations.rizzResponseDescription,
        status: conversations.status,
      })
      .from(conversations)
      .orderBy(desc(conversations.createdAt))
      .limit(limit);
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
    status: "initial" | "refining" | "completed"
  ): Promise<Conversation | null> {
    return await this.updateConversation(conversationId, { status });
  }
}
