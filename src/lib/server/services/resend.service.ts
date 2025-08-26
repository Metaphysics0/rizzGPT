import { RESEND_API_KEY } from "$env/static/private";
import { Resend } from "resend";

const resend = new Resend(RESEND_API_KEY);

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    console.log(
      `[ResendService] Sending email to ${
        params.to
      } with data: ${JSON.stringify(params)}`
    );
    const { to, subject, html } = params;
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });
    return response;
  } catch (error) {
    console.error("Error sending email", error);
    throw error;
  }
}
