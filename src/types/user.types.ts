import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId; // Explicitly define _id as ObjectId
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
}

export interface IActivityLog extends Document {
  userId: Types.ObjectId;
  action: string;
  details?: string;
}