import { desc, eq } from "drizzle-orm";
import { db } from "../database/connection";
import { conversationMessages, conversations, users } from "../database/schema";
import type {
  Conversation,
  ConversationMessage,
  ConversationWithMessages,
  KindeUser,
  NewConversation,
  NewConversationMessage,
  NewUser,
  User,
} from "../database/types";

export class DatabaseService {
  async upsertUserFromKinde(kindeUser: KindeUser): Promise<User> {
    const userData: NewUser = {
      id: crypto.randomUUID(),
      kindeId: kindeUser.id,
      email: kindeUser.email,
      givenName: kindeUser.given_name || null,
      familyName: kindeUser.family_name || null,
      picture: kindeUser.picture || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.kindeId, kindeUser.id))
      .limit(1);

    if (existingUsers.length > 0) {
      // Update existing user
      const [updatedUser] = await db
        .update(users)
        .set({
          email: kindeUser.email,
          givenName: kindeUser.given_name || null,
          familyName: kindeUser.family_name || null,
          picture: kindeUser.picture || null,
          updatedAt: new Date(),
        })
        .where(eq(users.kindeId, kindeUser.id))
        .returning();

      return updatedUser;
    } else {
      // Create new user
      const [newUser] = await db.insert(users).values(userData).returning();
      return newUser;
    }
  }

  async getUserByKindeId(kindeId: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.kindeId, kindeId))
      .limit(1);

    return result[0] || null;
  }

  async getUserById(userId: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result[0] || null;
  }

  async createConversation(
    conversationData: Omit<NewConversation, "id" | "createdAt" | "updatedAt">
  ): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversations)
      .values({
        ...conversationData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return newConversation;
  }

  async getConversationsForUser(
    userId: string
  ): Promise<
    Pick<
      Conversation,
      | "id"
      | "matchName"
      | "createdAt"
      | "updatedAt"
      | "status"
      | "rizzResponseDescription"
    >[]
  > {
    return await db
      .select({
        id: conversations.id,
        matchName: conversations.matchName,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        rizzResponseDescription: conversations.rizzResponseDescription,
        status: conversations.status,
      })
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.createdAt));
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
    updates: Partial<Omit<NewConversation, "id" | "userId" | "createdAt">>
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

  // Conversation Messages Methods
  async addMessageToConversation(
    messageData: Omit<NewConversationMessage, "id" | "createdAt">
  ): Promise<ConversationMessage> {
    const [newMessage] = await db
      .insert(conversationMessages)
      .values({
        ...messageData,
        createdAt: new Date(),
      })
      .returning();

    return newMessage;
  }

  async getConversationWithMessages(
    conversationId: string
  ): Promise<ConversationWithMessages | null> {
    // Get the conversation
    const conversation = await this.getConversationById(conversationId);
    if (!conversation) return null;

    // Get all messages for this conversation
    const messages = await db
      .select()
      .from(conversationMessages)
      .where(eq(conversationMessages.conversationId, conversationId))
      .orderBy(conversationMessages.messageOrder);

    return {
      ...conversation,
      messages,
    };
  }

  async getMessagesForConversation(
    conversationId: string
  ): Promise<ConversationMessage[]> {
    return await db
      .select()
      .from(conversationMessages)
      .where(eq(conversationMessages.conversationId, conversationId))
      .orderBy(conversationMessages.messageOrder);
  }

  async getNextMessageOrder(conversationId: string): Promise<number> {
    const lastMessage = await db
      .select()
      .from(conversationMessages)
      .where(eq(conversationMessages.conversationId, conversationId))
      .orderBy(conversationMessages.messageOrder)
      .limit(1);

    return lastMessage.length > 0 ? lastMessage[0].messageOrder + 1 : 1;
  }

  async updateConversationStatus(
    conversationId: string,
    status: "initial" | "refining" | "completed"
  ): Promise<Conversation | null> {
    return await this.updateConversation(conversationId, { status });
  }
}
