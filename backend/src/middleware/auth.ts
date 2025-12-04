import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase";

export interface AuthenticatedRequest extends Request {
  user?: { uid: string; email?: string | null };
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = header.substring("Bearer ".length);

  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email ?? null };
    next();
  } catch (err) {
    console.error("Token verification failed", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}
