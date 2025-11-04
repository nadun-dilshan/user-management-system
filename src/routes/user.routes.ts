import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();
const userController = new UserController();

router.get('/me', authenticate(), userController.getUser);
router.put('/me', authenticate(), userController.updateUser);
router.delete('/me', authenticate(), userController.deleteUser);

export default router;