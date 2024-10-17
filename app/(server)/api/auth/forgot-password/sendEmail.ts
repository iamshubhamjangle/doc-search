const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const SES_CONFIG = {
  credentials: {
    accessKeyId: process.env.AWS_SES_USER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_USER_ACCESS_SECRET,
  },
  region: process.env.AWS_SES_REGION,
};

const APP_NAME = "NEXT AUTH DEMO";
const APP_SUPPORT_EMAIL = "support@example.com";
const sesClient = new SESClient(SES_CONFIG);

export default function sendEmail(
  username: string,
  email: string,
  passwordResetURL: string
) {
  return new Promise(async (resolve, reject) => {
    let params = {
      Source: process.env.AWS_SES_SENDER,
      Destination: {
        ToAddresses: [email],
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
<body>
  <p>Hi ${username},</p>

  <p>We received a request to reset your password for your ${APP_NAME} account. If you did not initiate this request, please ignore this email.</p>

  <p>If you did request a password reset, please click on the following link to reset your password:</p>

  <a href="${passwordResetURL}">RESET YOUR PASSWORD</a>

  <p>If you are unable to click on the link, please copy and paste it into your web browser.</p>

  <p>Your new password will be required to access your ${APP_NAME} account. If you have any questions, please contact us at ${APP_SUPPORT_EMAIL}.</p>

  <p>
    <div>Thank you,</div>
    <div>The ${APP_NAME} team</div>
  </p>
</body>
            `,
          },
          Text: {
            Charset: "UTF-8",
            Data: `
Hi ${username},
\n\n
We received a request to reset your password for your ${APP_NAME} account. If you did not initiate this request, please ignore this email.
\n\n
If you did request a password reset, please click on the following link to reset your password:
\n\n
${passwordResetURL}
\n\n
If you are unable to click on the link, please copy and paste it into your web browser.
\n\n
Your new password will be required to access your ${APP_NAME} account. If you have any questions, please contact us at ${APP_SUPPORT_EMAIL}.
\n\n
Thank you,
\n
The ${APP_NAME} team 
            `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: `Password reset for ${APP_NAME}`,
        },
      },
    };

    try {
      const sendEmailCommand = new SendEmailCommand(params);
      const res = await sesClient.send(sendEmailCommand);
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}
