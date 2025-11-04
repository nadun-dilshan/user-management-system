import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `http://localhost:${env.PORT}/api/auth/verify/${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Verify Your Account',
    html: `<p>Click <a href="${url}">here</a> to verify your account.</p>`,
  });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const url = `http://localhost:${env.PORT}/api/auth/reset-password/${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Reset Your Password',
    html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
  });
};