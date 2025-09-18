import { RESEND_API_KEY, RESEND_FROM_EMAIL } from "$env/static/private";
import { Resend } from "resend";
import { logArgs } from "$lib/server/decorators/log-args.decorator";
import { signUpVerificationEmailTemplate } from "../email-templates/sign-up-verification-email-template";

export class ResendService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(RESEND_API_KEY);
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }
  }

  async sendSignUpVerificationEmail(params: {
    to: string;
    url: string;
    name: string;
  }) {
    const { to, url, name } = params;
    return this.sendHtmlEmail({
      to,
      subject: "Verify your email address",
      html: signUpVerificationEmailTemplate({ url, name }),
    });
  }

  @logArgs({
    label: "ResendService",
    prefix: "sending email with data",
    formatArgs: ([params]) => params,
  })
  private async sendHtmlEmail(params: {
    to: string;
    subject: string;
    html: string;
  }) {
    const { to, subject, html } = params;
    return this.resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    });
  }
}
