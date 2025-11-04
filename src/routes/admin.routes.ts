import express from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const adminController = new AdminController();

router.get('/users', authenticate(['admin']), adminController.getAllUsers);
router.put('/users/:userId', authenticate(['admin']), adminController.updateUser);
router.delete('/users/:userId', authenticate(['admin']), adminController.deleteUser);
router.get('/activity-logs', authenticate(['admin']), adminController.getActivityLogs);

export default router;