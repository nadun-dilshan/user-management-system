import mongoose, { Schema } from 'mongoose';
import { IActivityLog } from '../types/user.types';

const activityLogSchema = new Schema<IActivityLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: String },
}, { timestamps: true });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);