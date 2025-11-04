import { User } from '../models/user.model';
import { ActivityLog } from '../models/activityLog.model';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';
import { hashPassword, comparePassword } from '../utils/bcrypt.utils';
import { sendVerificationEmail, sendResetPasswordEmail } from '../utils/email.utils';
import crypto from 'crypto';

export class AuthService {
  async register(email: string, password: string, firstName: string, lastName: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already exists');

    const hashedPassword = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      verificationToken,
    });

    await user.save();
    await sendVerificationEmail(email, verificationToken);
    await ActivityLog.create({ userId: user._id, action: 'REGISTER', details: `User ${email} registered` });

    return { message: 'User registered. Please verify your email.' };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    if (!user.isVerified) throw new Error('Account not verified');

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();
    await ActivityLog.create({ userId: user._id, action: 'LOGIN', details: `User ${email} logged in` });

    return { accessToken, refreshToken };
  }

  async verifyEmail(token: string) {
    const user = await User.findOne({ verificationToken: token });
    if (!user) throw new Error('Invalid or expired token');

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    await ActivityLog.create({ userId: user._id, action: 'VERIFY_EMAIL', details: `User ${user.email} verified email` });

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    await sendResetPasswordEmail(email, resetToken);
    await ActivityLog.create({ userId: user._id, action: 'FORGOT_PASSWORD', details: `Password reset requested for ${email}` });

    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) throw new Error('Invalid or expired token');

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    await ActivityLog.create({ userId: user._id, action: 'RESET_PASSWORD', details: `Password reset for ${user.email}` });

    return { message: 'Password reset successfully' };
  }

  async refreshToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) throw new Error('Invalid refresh token');

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    return { accessToken };
  }

  async resendVerificationEmail(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    if (user.isVerified) throw new Error('User is already verified');

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);
    await ActivityLog.create({
      userId: user._id,
      action: 'RESEND_VERIFICATION_EMAIL',
      details: `Verification email resent to ${user.email}`,
    });

    return { message: 'Verification email resent successfully' };
  }
}