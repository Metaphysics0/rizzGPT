# RizzGPT

A web application that helps you generate better responses for dating conversations using AI.

## Features

- Upload conversation screenshots or screen recordings
- AI-powered response generation using Google Gemini
- Support for large file uploads (up to 50MB)
- Async background processing for better performance
- Modern serverless architecture with Vercel

## Architecture

The app uses a modern async architecture optimized for Vercel's serverless platform:

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
```

### Getting Your API Keys

1. **Gemini API Key**: 
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Add it as `GEMINI_API_KEY` in your Vercel environment variables

2. **Vercel Blob Token**:
   - In your Vercel dashboard, go to Storage → Blob
   - Create a new blob store if you haven't already
   - Copy the `BLOB_READ_WRITE_TOKEN` from the connection string
   - Add it to your Vercel environment variables

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
- **AI**: Google Gemini 2.5 Flash
- **Storage**: Vercel Blob
- **Deployment**: Vercel
- **Package Manager**: pnpm

## License

MIT License
