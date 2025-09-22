import {
  BACKBLAZE_APPLICATION_ID,
  BACKBLAZE_APPLICATION_KEY,
  BACKBLAZE_BUCKET_ID,
} from "$env/static/private";

export class BackblazeStorageService {
  BASE_API_URL = "https://api005.backblazeb2.com/b2api/v4";
  PUBLIC_API_URL = "https://api.backblazeb2.com/b2api/v4";

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
    validDurationSeconds: number = 3600
  ): Promise<string> {
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
          validDurationInSeconds: validDurationSeconds,
        }),
      }
    );

    const { authorizationToken } = await response.json();
    return `https://f005.backblazeb2.com/file/rizz-gpt/${fileName}?Authorization=${authorizationToken}`;
  }
}
