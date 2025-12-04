import { Router, Response } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import { auth } from "../config/firebase";
import { AppUser } from "../types/user";

const router = Router();
router.use(authenticate);

// GET /api/users
router.get("/", async (_req: AuthenticatedRequest, res: Response) => {
  const list = await auth.listUsers(100);
  const users: AppUser[] = list.users.map((u) => ({
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL
  }));
  res.json(users);
});

export default router;
