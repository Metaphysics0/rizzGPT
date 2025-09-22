import {
  BACKBLAZE_APPLICATION_ID,
  BACKBLAZE_APPLICATION_KEY,
  BACKBLAZE_BUCKET_ID,
} from "$env/static/private";

interface CacheEntry {
  url: string;
  expiresAt: number;
}

export class BackblazeStorageService {
  BASE_API_URL = "https://api005.backblazeb2.com/b2api/v4";
  PUBLIC_API_URL = "https://api.backblazeb2.com/b2api/v4";

  // In-memory cache for signed URLs
  private static urlCache = new Map<string, CacheEntry>();

  async getClientUploadUrl(): Promise<{
    authorizationToken: string;
    bucketId: string;
    uploadUrl: string;
  }> {
    const token = await this.getAuthorizationToken();

    return this.makeAuthorizedApiRequest({
      token,
      endpoint: "b2_get_upload_url",
    });
  }

  private async getAuthorizationToken(): Promise<string> {
    try {
      const response = await fetch(
        `${this.PUBLIC_API_URL}/b2_authorize_account`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${BACKBLAZE_APPLICATION_ID}:${BACKBLAZE_APPLICATION_KEY}`
            ).toString("base64")}`,
          },
        }
      );

      const data = await response.json();
      return data.authorizationToken as string;
    } catch (e) {
      console.error("Backblaze - Failed getting authorization token");
      throw new Error("Failed generating backblaze auth api token");
    }
  }

  private async makeAuthorizedApiRequest({
    token,
    endpoint,
  }: {
    token: string;
    endpoint: string;
  }) {
    const response = await fetch(
      `${this.BASE_API_URL}/${endpoint}?bucketId=${BACKBLAZE_BUCKET_ID}`,
      { headers: { Authorization: token } }
    );

    return response.json();
  }

  async getSignedDownloadUrl(
    fileName: string,
    validDurationInSeconds: number = 86400 // 24 hours since images never change
  ): Promise<string> {
    const cacheKey = `${fileName}:${validDurationInSeconds}`;
    const now = Date.now();
    const cached = BackblazeStorageService.urlCache.get(cacheKey);
    if (cached && cached.expiresAt > now) {
      console.log(`[Backblaze] - Cache HIT for ${cacheKey}`);
      return cached.url;
    }

    const token = await this.getAuthorizationToken();
    const response = await fetch(
      `${this.BASE_API_URL}/b2_get_download_authorization`,
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucketId: BACKBLAZE_BUCKET_ID,
          fileNamePrefix: fileName,
          validDurationInSeconds,
        }),
      }
    );

    const { authorizationToken } = await response.json();
    const signedUrl = `https://f005.backblazeb2.com/file/rizz-gpt/${fileName}?Authorization=${authorizationToken}`;

    // Cache the URL (expire 5 minutes before Backblaze token expires for safety)
    const cacheExpiresAt = now + (validDurationInSeconds - 300) * 1000;
    BackblazeStorageService.urlCache.set(cacheKey, {
      url: signedUrl,
      expiresAt: cacheExpiresAt,
    });

    this.cleanExpiredCache();

    return signedUrl;
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of BackblazeStorageService.urlCache.entries()) {
      if (entry.expiresAt <= now) {
        BackblazeStorageService.urlCache.delete(key);
      }
    }
  }
}
