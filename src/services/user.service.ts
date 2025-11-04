import { User } from '../models/user.model';
import { ActivityLog } from '../models/activityLog.model';
import { hashPassword } from '../utils/bcrypt.utils';

export class UserService {
  async getUser(userId: string) {
    const user = await User.findById(userId).select('-password -refreshToken -verificationToken -resetPasswordToken -resetPasswordExpires');
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUser(userId: string, updates: { firstName?: string; lastName?: string; email?: string; password?: string }) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (updates.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser && existingUser._id.toString() !== userId) throw new Error('Email already exists');
    }

    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    Object.assign(user, updates);
    await user.save();
    await ActivityLog.create({ userId, action: 'UPDATE_PROFILE', details: `User ${user.email} updated profile` });

    return user;
  }

  async deleteUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    await user.deleteOne();
    await ActivityLog.create({ userId, action: 'DELETE_ACCOUNT', details: `User ${user.email} deleted account` });

    return { message: 'User deleted successfully' };
  }
}