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
    <header>
      🚀 RizzGPT
    </header>
    <p>What's up ${name},</p>
    <p>Almost in rizz town.</p>
    <p>Click the link to verify your email: <a href="${url}">${url}</a></p>
    <p>If you did not request this verification, please ignore this email.</p>
    <p>Thanks,</p>
    <p>Ryan from RizzGPT</p>
    </body>
  </html>
  `;
};
