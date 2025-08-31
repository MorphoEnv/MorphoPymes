import nodemailer from 'nodemailer';
import path from 'path';

const SMTP_HOST = process.env.SMTP_HOST || 'mail.spacemail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_SECURE = (process.env.SMTP_SECURE || 'true') === 'true';
const SMTP_USER = process.env.SMTP_USER || 'info@morphopymes.lat';
const SMTP_PASS = process.env.SMTP_PASS || 'cpb6)eMs';
const FROM_NAME = process.env.FROM_NAME || 'MorphoPymes';
const FROM_EMAIL = process.env.FROM_EMAIL || 'info@morphopymes.lat';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

transporter.verify().then(() => {
  console.log('✅ SMTP transporter ready');
}).catch((err) => {
  console.warn('⚠️ SMTP transporter verify failed:', err.message || err);
});

function welcomeTemplate(name: string, verifyUrl: string) {
  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Welcome to MorphoPymes</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif; background:#f6f9fc; margin:0; padding:20px;">
      <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08)">
        <div style="padding:24px; background:linear-gradient(90deg,#4f46e5,#06b6d4); color:#fff; text-align:center">
          <h1 style="margin:0; font-size:20px">Welcome to MorphoPymes</h1>
          <p style="margin:6px 0 0; opacity:0.9">You're one step away from completing your account</p>
        </div>
        <div style="padding:24px; color:#111">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thanks for joining MorphoPymes. To finish setting up your account, please verify your email by clicking the button below.</p>
          <p style="text-align:center; margin:24px 0">
            <a href="${verifyUrl}" style="display:inline-block; padding:12px 20px; background:#06b6d4; color:#fff; border-radius:8px; text-decoration:none; font-weight:600">Verify email</a>
          </p>
          <p style="font-size:13px; color:#666">If you didn't create an account you can safely ignore this email.</p>
          <hr style="border:none; border-top:1px solid #eee; margin:16px 0" />
          <p style="font-size:12px; color:#999">MorphoPymes · Bringing entrepreneurs and investors together</p>
        </div>
      </div>
    </body>
  </html>`;
}

export const EmailService = {
  sendVerificationEmail: async (to: string, name: string, verifyUrl: string) => {
    const html = welcomeTemplate(name, verifyUrl);
    const info = await transporter.sendMail({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject: 'Verifica tu correo en MorphoPymes',
      html,
    });
    console.log('✉️ Verification email sent:', info.messageId);
    return info;
  },

  sendWelcomeEmail: async (to: string, name: string) => {
    const html = `<!doctype html><html><body><h1>Welcome, ${name}</h1><p>Thanks for joining MorphoPymes</p></body></html>`;
    const info = await transporter.sendMail({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject: 'Welcome to MorphoPymes',
      html,
    });
    console.log('✉️ Welcome email sent:', info.messageId);
    return info;
  }
};

export default transporter;
