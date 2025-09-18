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
      header {
        background-color: #9333ea;
        color: #fff;
        padding: 10px;
        text-align: center;
      }
      h1 {
        color: #9333ea;
      }
      p {
        color: #333;
      }
      a {
        color: #9333ea;
      }
      footer {
        background-color: #9333ea;
        color: #fff;
        padding: 10px;
        text-align: center;
      }
      footer p {
        color: #fff;
      }
    </style>
    <head>
      <title>Verify your email address</title>
    </head>
    <body>
    <header>
      🚀 RizzGPT
    </header>
    <h1>Verify your email address</h1>
    <p>Hello ${name},</p>
    <p>Click the link to verify your email: <a href="${url}">${url}</a></p>
    <p>If you did not request this verification, please ignore this email.</p>
    <p>Thank you,</p>
    <p>The RizzGPT Team</p>
    </body>
  </html>
  `;
};
