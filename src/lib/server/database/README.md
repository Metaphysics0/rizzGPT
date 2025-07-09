# Database Setup with Neon and Drizzle ORM

This project uses [Neon](https://neon.tech/) as the PostgreSQL database and [Drizzle ORM](https://orm.drizzle.team/) for database operations.

## Quick Setup

### 1. Environment Variables

Add your Neon database URL to your `.env` file:

```env
DATABASE_URL="postgresql://username:password@endpoint/database?sslmode=require"
```

You can get this URL from your Neon dashboard.

### 2. Generate and Run Migrations

```bash
# Generate migration files from schema
pnpm db:generate

# Push schema directly to database (for development)
pnpm db:push

# Or run migrations (for production)
pnpm db:migrate
```

### 3. Database Studio (Optional)

To view and manage your database with a GUI:

```bash
pnpm db:studio
```

## Database Schema

### Users Table
Syncs with Kinde authentication data:

```typescript
{
  id: uuid (primary key)
  kindeId: string (unique) // Kinde user ID
  email: string
  givenName?: string
  familyName?: string
  picture?: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Conversations Table
Stores conversation data and generated responses:

```typescript
{
  id: uuid (primary key)
  userId: uuid (foreign key to users.id)
  rizzResponses: string[] // Array of generated responses
  rizzResponseDescription: string
  uploadedConversationBlobUrl: string
  matchContext: string
  matchName: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Usage Examples

### Using the Database Service

```typescript
import { DatabaseService } from "$lib/server/services/database.service";

const dbService = new DatabaseService();

// Sync user from Kinde
const user = await dbService.upsertUserFromKinde(kindeUser);

// Create conversation
const conversation = await dbService.createConversation({
  userId: user.id,
  rizzResponses: ["Hey there!", "How's your day?", "Love your smile!"],
  rizzResponseDescription: "Casual and friendly approach",
  uploadedConversationBlobUrl: "https://blob.url/conversation.jpg",
  matchContext: "Coffee shop match",
  matchName: "Sarah"
});

// Get user's conversations
const conversations = await dbService.getConversationsForUser(user.id);
```

### API Endpoints

- `GET /api/conversations` - Get all conversations for authenticated user
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/[id]` - Get specific conversation
- `PUT /api/conversations/[id]` - Update conversation
- `DELETE /api/conversations/[id]` - Delete conversation

### Example API Usage

```typescript
// Create conversation
const response = await fetch('/api/conversations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    rizzResponses: ["Hey!", "How are you?"],
    rizzResponseDescription: "Friendly opener",
    uploadedConversationBlobUrl: "https://blob.url/image.jpg",
    matchContext: "Dating app match",
    matchName: "Alex"
  })
});

// Get conversations
const conversations = await fetch('/api/conversations').then(r => r.json());
```

## Available Scripts

- `pnpm db:generate` - Generate migration files from schema changes
- `pnpm db:push` - Push schema directly to database (development)
- `pnpm db:migrate` - Run migrations (production)
- `pnpm db:studio` - Open Drizzle Studio for database management

## Authentication Integration

The database automatically syncs with Kinde authentication:

1. When a user signs in, their data is automatically synced to the `users` table
2. User information is kept up-to-date on each authentication check
3. The `requireAuth` function now returns both Kinde user data and database user data

## Error Handling

- Database connections are automatically managed
- Failed user syncs don't break authentication flow
- All database operations include proper error handling
- Foreign key constraints ensure data integrity

## Development Tips

1. Use `pnpm db:studio` to visually inspect your data during development
2. Use `pnpm db:push` for quick schema changes during development
3. Always use `pnpm db:generate` and `pnpm db:migrate` for production deployments
4. The database service follows the same patterns as other services in the project 