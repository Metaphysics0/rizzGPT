# Storage 🥫

We are using Backblaze, an s3 alternative.

## User Uploads & Security

User uploads are stored in a user-scoped directory structure (`uploads/{userId}/{fileName}`) to ensure privacy and isolation.
Files are only accessible to the authenticated user who uploaded them through signed download URLs that expire after 24 hours.

## Caching Strategy

We implement server-side caching for Backblaze download authorization tokens to minimize API calls and improve performance.
Since uploaded images are immutable, we use aggressive caching with 24-hour expiration times and set appropriate HTTP cache headers (`Cache-Control: public, max-age=86400, immutable`) for optimal browser caching.

## Pre-requisites

We need to enable CORS on the bucket for local development. you simply need to enable it on your bucket from backblaze's CLI.
Just run cd into `sh/` and run the `set-cors-for-backblaze.sh` command

https://www.backblaze.com/docs/cloud-storage-enable-cors-with-the-cli
