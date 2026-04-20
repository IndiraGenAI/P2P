import * as nodemailer from 'nodemailer';

export async function sendEmail(
  emailIds: string,
  tableHtml: string,
  subject: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const message = {
    to: emailIds,
    from: process.env.EMAIL_FROM,
    subject: subject,
    html: tableHtml,
  };
  transporter.sendMail(message, (error, info) => {
    if (error) {
      throw error;
    } else {
      return info.response;
    }
  });
}
