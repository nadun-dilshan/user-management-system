import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password, firstName, lastName } = req.body;
    try {
      const result = await authService.register(email, password, firstName, lastName);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const tokens = await authService.login(email, password);
      res.json(tokens);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    const { token } = req.params;
    try {
      const result = await authService.verifyEmail(token);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const result = await authService.forgotPassword(email);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const result = await authService.resetPassword(token, password);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    try {
      const result = await authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async resendVerificationEmail(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
      const result = await authService.resendVerificationEmail(email);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}