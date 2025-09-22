import {
  BACKBLAZE_APPLICATION_ID,
  BACKBLAZE_APPLICATION_KEY,
  BACKBLAZE_BUCKET_ID,
} from "$env/static/private";

export class BackblazeStorageService {
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
        "https://api.backblazeb2.com/b2api/v4/b2_authorize_account",
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
      `https://api005.backblazeb2.com/b2api/v4/${endpoint}?bucketId=${BACKBLAZE_BUCKET_ID}`,
      { headers: { Authorization: token } }
    );

    return response.json();
  }
}
