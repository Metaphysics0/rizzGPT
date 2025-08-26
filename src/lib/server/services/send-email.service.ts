import { RESEND_API_KEY, RESEND_FROM_EMAIL } from "$env/static/private";
import { Resend } from "resend";

export class ResendService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(RESEND_API_KEY);
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }
  }

  async sendEmail(params: { to: string; subject: string; text: string }) {
    const { to, subject, text } = params;
    return this.wrapWithLogging(
      () =>
        this.resend.emails.send({
          from: RESEND_FROM_EMAIL,
          to,
          subject,
          text,
        }),
      params
    );
  }

  private async wrapWithLogging(
    fn: () => Promise<any>,
    params: { to: string; subject: string; text: string }
  ) {
    try {
      console.log(
        `[ResendService] Sending email to ${
          params.to
        } with data: ${JSON.stringify(params)}`
      );
      const response = await fn();
      console.log(
        `[ResendService] Email sent to ${params.to} with data: ${JSON.stringify(
          params
        )}`
      );
      return response;
    } catch (error) {
      console.error("Error sending email", error);
      throw error;
    }
  }
}
