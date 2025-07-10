# RizzGPT

A web application that helps you generate better responses for dating conversations using AI.

## Features

- Upload conversation screenshots or screen recordings
- AI-powered response generation using Google Gemini
- Support for large file uploads (up to 50MB)
- Async background processing for better performance
- Modern serverless architecture with Vercel
- Service-based architecture for maintainability and scalability

## Architecture

The app uses a modern async architecture optimized for Vercel's serverless platform with clean separation of concerns:

### Service Layer
- **BlobStorageService**: Handles all file uploads, storage, and retrieval operations
- **JobProcessingService**: Manages background job processing with Gemini AI
- **GeminiService**: Focused AI processing with Google Gemini

### API Layer
- **Thin Controllers**: Minimal logic, delegating to services
- **Clear Separation**: Controllers handle HTTP concerns, services handle business logic
- **Type Safety**: Strong TypeScript interfaces for all service contracts

### Flow
1. **Direct Upload**: Files are uploaded directly to Vercel Blob storage, bypassing function payload limits
2. **Background Processing**: AI processing happens asynchronously in the background
3. **Real-time Updates**: Frontend polls for completion and updates the UI when ready
4. **Scalable**: No blocking operations, each request processes independently

## Environment Variables

You'll need to set up the following environment variables in your Vercel dashboard:

```env
# Required for Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Required for Vercel Blob storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

# Required for Neon PostgreSQL database
DATABASE_URL=your_neon_database_url_here

# Required for Upstash QStash (background job processing)
QSTASH_TOKEN=your_qstash_token_here
QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key_here
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key_here

# Required for Kinde Authentication
KINDE_CLIENT_ID=your_kinde_client_id_here
KINDE_CLIENT_SECRET=your_kinde_client_secret_here
KINDE_ISSUER_URL=your_kinde_issuer_url_here
KINDE_SITE_URL=your_site_url_here
KINDE_POST_LOGOUT_REDIRECT_URL=your_post_logout_url_here
KINDE_POST_LOGIN_REDIRECT_URL=your_post_login_url_here
```

### Getting Your API Keys

1. **Gemini API Key**: 
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Add it as `GEMINI_API_KEY` in your Vercel environment variables

2. **Neon Database**:
   - Sign up at [Neon](https://neon.tech/)
   - Create a new project
   - Copy the connection string from your dashboard
   - Add it as `DATABASE_URL` in your environment variables

3. **Vercel Blob Token**:
   - In your Vercel dashboard, go to Storage → Blob
   - Create a new blob store if you haven't already
   - Copy the `BLOB_READ_WRITE_TOKEN` from the connection string
   - Add it to your Vercel environment variables

4. **Upstash QStash**:
   - Sign up at [Upstash](https://upstash.com/)
   - Create a new QStash instance
   - Copy the `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, and `QSTASH_NEXT_SIGNING_KEY` from your dashboard
   - Add all three to your Vercel environment variables

5. **Kinde Authentication**:
   - Sign up at [Kinde](https://kinde.com/)
   - Create a new application
   - Copy the required values from your Kinde dashboard
   - Set up your redirect URLs to match your deployment URL

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm check

# Linting and formatting
pnpm lint
pnpm format
```

## Project Structure

```
src/
├── lib/
│   ├── services/                    # Business logic services
│   │   ├── blob-storage.service.ts  # File upload/storage operations
│   │   ├── job-processing.service.ts # Background job processing
│   │   ├── types.ts                 # Service interfaces & types
│   │   └── index.ts                 # Service exports
│   ├── server/
│   │   └── gemini.service.ts        # AI processing service
│   └── ...
├── routes/
│   └── api/
│       ├── upload/                  # File upload endpoint
│       ├── process-rizz/           # Job processing endpoint
│       └── job-status/[jobId]/     # Status checking endpoint
└── ...
```

## Service Architecture Benefits

- **Maintainability**: Clear separation of concerns with dedicated services
- **Testability**: Services can be easily unit tested in isolation
- **Reusability**: Services can be used across multiple endpoints
- **Scalability**: Services can be easily extended or swapped out
- **Type Safety**: Strong interfaces ensure reliable service contracts

## Deployment

This app is designed to deploy on Vercel:

1. Connect your GitHub repository to Vercel
2. Set up the required environment variables
3. Deploy!

The app will automatically handle:
- File uploads up to 50MB
- Background processing with Gemini AI
- Automatic scaling based on demand

## File Size Limits

- **Development**: Up to 50MB per file
- **Production**: Up to 50MB per file (Vercel Blob supports up to 500MB)
- **Supported formats**: JPG, PNG, WebP, MP4, QuickTime, AVI

## Technology Stack

- **Frontend**: SvelteKit 2, TypeScript, Tailwind CSS
- **Backend**: SvelteKit API routes, Vercel serverless functions
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Kinde Auth (synced with database)
- **AI**: Google Gemini 2.5 Flash
- **Storage**: Vercel Blob
- **Architecture**: Service-based with dependency injection
- **Deployment**: Vercel
- **Package Manager**: pnpm

## License

MIT License

## 🏗️ **NEW: Edge Function Background Processing Architecture**

We've modernized the processing pipeline to use **Vercel Edge Functions** for true background processing:

### **How It Works**

1. **Client Upload**: Files are uploaded directly to Vercel Blob Storage
2. **Edge Function Trigger**: Background processing starts immediately via Edge Function
3. **Background Processing**: Edge Function uses `waitUntil()` to process jobs asynchronously
4. **Real-time Updates**: Frontend polls for job status while processing happens in background

### **Key Benefits**

- ✅ **True Background Processing**: Jobs run independently of HTTP request/response cycles
- ✅ **No Timeouts**: Edge Functions can process indefinitely (respond within 25s, continue processing)
- ✅ **Vercel Native**: Uses Vercel's Edge Runtime - no external dependencies
- ✅ **Scalable**: Automatic scaling with Vercel's infrastructure
- ✅ **Reliable**: Built-in retry logic and error handling

### **Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   File Upload   │───▶│  Vercel Blob     │    │  Edge Function  │
│   (Frontend)    │    │  Storage         │    │  (Background)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │                       │              │  Gemini AI      │
         │                       │              │  Processing     │
         │                       │              └─────────────────┘
         │                       │                       │
         │                       │                       ▼
         │                       │              ┌─────────────────┐
         │              ┌────────▼──────────────▼─────────────────┐
         │              │     Result Storage (Blob)              │
         │              └─────────────────────────────────────────┘
         │                       │
         ▼                       │
┌─────────────────┐              │
│  Status Polling │◀─────────────┘
│  (Frontend)     │
└─────────────────┘
```

### **Edge Function Configuration**

The `/api/process-job` endpoint is configured as an Edge Function:

```typescript
// Configure this function to use Edge Runtime for background processing
export const config = {
  runtime: 'edge'
};

export const POST = async ({ request }) => {
  // Start background processing using waitUntil
  const processingPromise = processJobInBackground(jobId, blobUrl, formData);
  
  // Mark the promise as a background task
  waitUntil(processingPromise);

  // Return immediately while processing continues in background
  return json({ success: true, jobId });
};
```

### **Environment Variables**

```bash
# Required for Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Required for Vercel Blob storage operations
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```



## Troubleshooting
- in order for upstash to work, you need to run the project with localtunnel - `lt --port 5173`, then add it to the vite.config.ts