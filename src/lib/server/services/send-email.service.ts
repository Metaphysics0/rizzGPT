import { RESEND_API_KEY, RESEND_FROM_EMAIL } from "$env/static/private";
import { Resend } from "resend";
import { logArgs } from "$lib/server/decorators/log-args.decorator";

export class ResendService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(RESEND_API_KEY);
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }
  }

  @logArgs({ label: "ResendService", formatArgs: ([params]) => params })
  async sendEmail(params: { to: string; subject: string; text: string }) {
    const { to, subject, text } = params;
    return this.resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to,
      subject,
      text,
    });
  }
}
