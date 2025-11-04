import { User } from '../models/user.model';
import { ActivityLog } from '../models/activityLog.model';

export class AdminService {
  async getAllUsers() {
    return User.find().select('-password -refreshToken -verificationToken -resetPasswordToken -resetPasswordExpires');
  }

  async updateUser(userId: string, updates: { role?: 'user' | 'admin'; isVerified?: boolean }) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    Object.assign(user, updates);
    await user.save();
    await ActivityLog.create({ userId, action: 'ADMIN_UPDATE', details: `Admin updated user ${user.email}` });

    return user;
  }

  async deleteUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    await user.deleteOne();
    await ActivityLog.create({ userId, action: 'ADMIN_DELETE', details: `Admin deleted user ${user.email}` });

    return { message: 'User deleted by admin' };
  }

  async getActivityLogs(userId?: string) {
    const query = userId ? { userId } : {};
    return ActivityLog.find(query).populate('userId', 'email firstName lastName');
  }
}