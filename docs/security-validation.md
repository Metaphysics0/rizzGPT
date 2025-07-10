# Security Validation

This document explains the security validation implementation for RizzGPT API endpoints, including both user authentication and message queue signature verification.

## Overview

Our API endpoints implement two layers of security:

1. **Kinde Authentication** - Validates that requests come from authenticated users
2. **Upstash QStash Signature Verification** - Validates that background job requests come from Upstash QStash

## Authentication with Kinde

### Setup

Kinde authentication is already configured in the project. The `requireAuth` function handles:

- Session validation
- User data retrieval from Kinde
- Database user synchronization

### Usage

```typescript
import { requireAuth } from "$lib/server/auth";

export const POST = async ({ request }) => {
  // Validate authentication
  const authResult = await requireAuth(request);
  if (authResult.error) {
    return authResult.error; // Returns 401 with error message
  }

  // Use authenticated user data
  const user = authResult.user; // Kinde user object
  const dbUser = authResult.dbUser; // Database user object
  
  // Your endpoint logic here...
};
```

### Required Environment Variables

```bash
KINDE_CLIENT_ID=your_kinde_client_id_here
KINDE_CLIENT_SECRET=your_kinde_client_secret_here
KINDE_ISSUER_URL=your_kinde_issuer_url_here
KINDE_SITE_URL=your_site_url_here
KINDE_POST_LOGOUT_REDIRECT_URL=your_post_logout_url_here
KINDE_POST_LOGIN_REDIRECT_URL=your_post_login_url_here
```

## Upstash QStash Signature Verification

### Purpose

When using Upstash QStash for background job processing, we need to verify that incoming webhook requests actually come from Upstash and haven't been tampered with.

### Setup

QStash signature verification uses cryptographic signatures to ensure message authenticity. Each message includes a signature in the `Upstash-Signature` header.

### Usage

#### Option 1: Using the Utility Function (Recommended)

```typescript
import { validateUpstashSignature } from "$lib/server/utils/api-response.util";

export const POST = async ({ request }) => {
  // Validate Upstash signature
  const signatureValidation = await validateUpstashSignature(request);
  if (!signatureValidation.isValid) {
    return signatureValidation.error!; // Returns appropriate error response
  }

  // Get the validated request body
  const body = signatureValidation.body!;
  const payload = JSON.parse(body);
  
  // Your endpoint logic here...
};
```

#### Option 2: Manual Implementation

```typescript
import { Receiver } from "@upstash/qstash";
import { QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY } from "$env/static/private";

export const POST = async ({ request }) => {
  const receiver = new Receiver({
    currentSigningKey: QSTASH_CURRENT_SIGNING_KEY,
    nextSigningKey: QSTASH_NEXT_SIGNING_KEY,
  });

  const body = await request.text();
  const signature = request.headers.get("Upstash-Signature");

  const isValid = await receiver.verify({
    signature: signature!,
    body,
  }).catch(() => false);

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Your endpoint logic here...
};
```

### Required Environment Variables

```bash
QSTASH_TOKEN=your_qstash_token_here
QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key_here
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key_here
```

### Getting Your QStash Keys

1. Sign up at [Upstash](https://upstash.com/)
2. Create a new QStash instance
3. Navigate to your QStash dashboard
4. Copy the three required values:
   - `QSTASH_TOKEN` - For publishing messages
   - `QSTASH_CURRENT_SIGNING_KEY` - For verifying signatures
   - `QSTASH_NEXT_SIGNING_KEY` - For key rotation support

## Combined Authentication Example

Here's how to implement both validations in a single endpoint:

```typescript
import { requireAuth } from "$lib/server/auth";
import { validateUpstashSignature, jsonErrorResponse } from "$lib/server/utils/api-response.util";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    // 1. Validate Upstash signature first
    const signatureValidation = await validateUpstashSignature(request);
    if (!signatureValidation.isValid) {
      return signatureValidation.error!;
    }

    // 2. Validate Kinde authentication
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return authResult.error;
    }

    if (!authResult.dbUser) {
      return jsonErrorResponse("User not found in database", 401);
    }

    // 3. Process the validated request
    const body = signatureValidation.body!;
    const payload = JSON.parse(body);
    
    // Your business logic here using authResult.dbUser.id
    
    return jsonSuccessResponse({ message: "Success" });
  } catch (error) {
    return unknownErrorResponse(error, "Processing failed");
  }
}) satisfies RequestHandler;
```

## Security Best Practices

1. **Always validate signatures first** - This prevents processing invalid requests early
2. **Use the utility functions** - They provide consistent error handling and logging
3. **Don't log sensitive data** - Avoid logging request bodies or authentication tokens
4. **Validate payload structure** - Even after signature verification, validate the expected data structure
5. **Handle errors gracefully** - Return appropriate HTTP status codes and error messages

## Testing

### Local Development

During local development, you can test endpoints by:

1. Setting up a local tunnel (e.g., ngrok) to expose your local server
2. Configuring QStash to send messages to your tunnel URL
3. Using the QStash console to send test messages

### Production

In production, ensure all environment variables are properly set in your deployment platform (Vercel, etc.).

## Troubleshooting

### Common Issues

1. **"QStash signing keys not configured"**
   - Ensure `QSTASH_CURRENT_SIGNING_KEY` and `QSTASH_NEXT_SIGNING_KEY` are set

2. **"Invalid Upstash signature"**
   - Check that your signing keys are correct
   - Ensure you're using the raw request body for verification
   - Verify that the request is actually coming from QStash

3. **"Authentication required"**
   - Ensure Kinde environment variables are properly configured
   - Check that the user session is valid

4. **"User not found in database"**
   - The user exists in Kinde but not in your database
   - Check the `upsertUserFromKinde` function

### Debug Tips

- Enable detailed logging in development
- Use the QStash console to inspect message delivery attempts
- Check your Vercel function logs for any errors
- Verify environment variables are set correctly in your deployment 