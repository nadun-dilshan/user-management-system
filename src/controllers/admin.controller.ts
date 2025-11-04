import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';

const adminService = new AdminService();

export class AdminController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await adminService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const user = await adminService.updateUser(userId, req.body);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const result = await adminService.deleteUser(userId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getActivityLogs(req: Request, res: Response) {
    const { userId } = req.query;
    try {
      const logs = await adminService.getActivityLogs(userId as string);
      res.json(logs);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}