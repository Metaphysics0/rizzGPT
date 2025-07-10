# Conversation Messages Feature

This document explains how to use the new conversation messages feature that allows users to have follow-up conversations to refine AI-generated responses.

## Database Schema

### Tables

1. **`conversations`** - Stores the initial conversation data (unchanged, with new `status` field)
2. **`conversation_messages`** - Stores the follow-up chat messages between user and AI

### Workflow

1. **Initial Flow**: User uploads screenshot → AI generates responses → saved in `conversations` table
2. **Refinement Flow**: User wants to improve responses → starts chat session → messages saved in `conversation_messages` table

## API Usage

### Get Conversation with Messages
```typescript
// GET /api/conversations/[id]/messages
const response = await fetch(`/api/conversations/${conversationId}/messages`);
const data = await response.json();

// Returns:
// {
//   conversation: { ...conversationData },
//   messages: [
//     { role: "user", content: "Make these responses more playful", messageOrder: 1 },
//     { role: "assistant", content: "Here are more playful versions...", messageOrder: 2 }
//   ]
// }
```

### Add Message to Conversation
```typescript
// POST /api/conversations/[id]/messages
const response = await fetch(`/api/conversations/${conversationId}/messages`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    role: 'user', // or 'assistant'
    content: 'Make these responses shorter and more casual'
  })
});
```

## Database Service Usage

```typescript
import { DatabaseService } from '$lib/server/services/database.service';

const db = new DatabaseService();

// Add a user message
await db.addMessageToConversation({
  conversationId: 'conv-123',
  role: 'user',
  content: 'Make these responses more playful',
  messageOrder: 1
});

// Add AI response
await db.addMessageToConversation({
  conversationId: 'conv-123',
  role: 'assistant',
  content: 'Here are more playful versions: ...',
  messageOrder: 2
});

// Get full conversation with messages
const conversationWithMessages = await db.getConversationWithMessages('conv-123');

// Update conversation status
await db.updateConversationStatus('conv-123', 'refining');
```

## Conversation Status

- **`initial`** - Just created, no refinement yet
- **`refining`** - User is actively refining responses
- **`completed`** - User is satisfied with responses

## Frontend Integration

### Basic Chat Component Structure
```svelte
<!-- ConversationChat.svelte -->
<script lang="ts">
  export let conversationId: string;
  
  let messages = [];
  let newMessage = '';
  
  async function loadMessages() {
    const response = await fetch(`/api/conversations/${conversationId}/messages`);
    const data = await response.json();
    messages = data.messages;
  }
  
  async function sendMessage() {
    await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'user',
        content: newMessage
      })
    });
    
    newMessage = '';
    await loadMessages(); // Refresh messages
  }
</script>

<!-- Chat UI here -->
```

## Migration

Run the migration with:
```bash
pnpm drizzle-kit push
```

Or if using a different migration approach, apply the generated SQL file:
```bash
# The migration file is located at:
# src/lib/server/database/migrations/0000_chilly_king_bedlam.sql
``` 