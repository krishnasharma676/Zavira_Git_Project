import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || '"Zavira" <no-reply@zavira.com>',
    to,
    subject,
    html,
  });
  return info;
};

export const sendOtpEmail = async (to: string, otp: string) => {
  const html = `
    <div style="font-family: sans-serif; background-color: #f6f6f6; padding: 40px 20px;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <h2 style="color: #7A578D; margin-bottom: 24px; text-align: center;">ZAVIRA</h2>
        <p style="color: #555; font-size: 16px; margin-bottom: 24px;">Your 6-digit verification code is:</p>
        <div style="background-color: #fdf2f8; border: 1px dashed #7A578D; padding: 16px; text-align: center; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: 900; color: #7A578D; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 32px; text-align: center;">This code will expire in 10 minutes. Please do not share this with anyone.</p>
      </div>
    </div>
  `;
  return await sendEmail(to, 'Verification Code for Zavira', html);
};
