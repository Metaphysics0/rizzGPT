import dedent from "dedent";

export const signUpVerificationEmailTemplate = ({
  name,
  url,
}: {
  name: string;
  url: string;
}) => {
  return dedent`
  <html>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
        color: #333;
      }
      a {
        color: #9333ea;
      }
    </style>
    <head>
      <title>Verify your email address</title>
    </head>
    <body>
    <p>What's up ${name},</p>
    <p>
      Thanks for checking out my app.
      You're almost in rizz town, you just need to click on the link to verify your email: 
      <a href="${url}">${url}</a>
    </p>
    <br>
    <p>
      If you did not request this verification, please ignore this email.
    </p>

    <br>

    <p>Thanks,</p>
    <p>Ryan</p>
    </body>
  </html>
  `;
};
