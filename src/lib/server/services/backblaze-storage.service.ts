import {
  BACKBLAZE_APPLICATION_ID,
  BACKBLAZE_APPLICATION_KEY,
  BACKBLAZE_BUCKET_ID,
  BACKBLAZE_BUCKET_NAME,
} from "$env/static/private";

interface CacheEntry {
  url: string;
  expiresAt: number;
}

class BackblazeStorageService {
  readonly BASE_API_URL = "https://api005.backblazeb2.com/b2api/v4";
  readonly PUBLIC_API_URL = "https://api.backblazeb2.com/b2api/v4";

  private static signedUrlCacheMap = new Map<string, CacheEntry>();

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

  async getSignedDownloadUrl(
    fileName: string,
    validDurationInSeconds: number = 86400 // 24 hours since images never change
  ): Promise<string> {
    const cacheKey = `${fileName}:${validDurationInSeconds}`;
    const now = Date.now();
    const cached = BackblazeStorageService.signedUrlCacheMap.get(cacheKey);
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
    const signedUrl = `https://f005.backblazeb2.com/file/${BACKBLAZE_BUCKET_NAME}/${fileName}?Authorization=${authorizationToken}`;

    // Cache the URL (expire 5 minutes before Backblaze token expires for safety)
    const cacheExpiresAt = now + (validDurationInSeconds - 300) * 1000;
    BackblazeStorageService.signedUrlCacheMap.set(cacheKey, {
      url: signedUrl,
      expiresAt: cacheExpiresAt,
    });

    this.cleanExpiredCache();

    return signedUrl;
  }

  async downloadFile(fileName: string): Promise<File> {
    try {
      const signedUrl = await this.getSignedDownloadUrl(fileName);

      const fileResponse = await fetch(signedUrl);
      if (!fileResponse.ok) {
        throw new Error(`Failed to download file: ${fileResponse.statusText}`);
      }

      const arrayBuffer = await fileResponse.arrayBuffer();
      const contentType =
        fileResponse.headers.get("content-type") || "image/jpeg";

      // Extract original filename from fileName or use default
      const filename = fileName.split("/").pop() || "uploaded-file";

      return new File([arrayBuffer], filename, { type: contentType });
    } catch (error) {
      console.error("Failed to download file from storage:", error);
      throw new Error("Failed to download file from storage");
    }
  }

  // mainly for server side uploads
  async uploadFile({ file, userId }: { file: File; userId: string }) {
    const { authorizationToken, uploadUrl } = await this.getClientUploadUrl();

    const fileContent = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-1", fileContent);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fileHash = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const extension = file.name.split(".").pop() || "bin";
    const filePath = `uploads/${userId}/${crypto.randomUUID()}.${extension}`;

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      mode: "cors",
      body: fileContent,
      headers: {
        "Content-Type": "b2/x-auto",
        Authorization: authorizationToken,
        "X-Bz-File-Name": encodeURIComponent(filePath),
        "X-Bz-Content-Sha1": fileHash,
      },
    });
    return uploadResponse.json();
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

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [
      key,
      entry,
    ] of BackblazeStorageService.signedUrlCacheMap.entries()) {
      if (entry.expiresAt <= now) {
        BackblazeStorageService.signedUrlCacheMap.delete(key);
      }
    }
  }
}

export const backblazeStorageService = new BackblazeStorageService();
