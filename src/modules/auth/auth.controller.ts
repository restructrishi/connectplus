import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import type { LoginBody, RegisterBody } from "./auth.validation.js";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as LoginBody;
    const result = await authService.login(body);
    res.status(200).json({ success: true, data: result, message: "Login successful" });
  } catch (e) {
    next(e);
  }
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as RegisterBody;
    const user = await authService.register(body);
    res.status(201).json({ success: true, data: user, message: "User registered" });
  } catch (e) {
    next(e);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const profile = await authService.getProfile(req.user.sub);
    res.status(200).json({ success: true, data: profile });
  } catch (e) {
    next(e);
  }
}
