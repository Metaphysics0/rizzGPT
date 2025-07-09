import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { conversations, users } from "../database/schema";
import type {
  Conversation,
  KindeUser,
  NewConversation,
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

  async getConversationsForUser(userId: string): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(conversations.createdAt);
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
}
