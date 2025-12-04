import { Router, Response } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import {
  listTodosForUser,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoById
} from "../services/todoService";

const router = Router();
router.use(authenticate);

// GET /api/todos
router.get("/", async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.uid;
  const todos = await listTodosForUser(uid);
  res.json(todos);
});

// POST /api/todos
router.post("/", async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.uid;
  const { title, content, description, type, checklist, color, labels, status, assigneeIds } =
    req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title is required" });
  }

  const todo = await createTodo(
    { title, content, description, type, checklist, color, labels, status, assigneeIds },
    uid
  );
  res.status(201).json(todo);
});

// PATCH /api/todos/:id
router.patch("/:id", async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.uid;
  const { id } = req.params;

  const existing = await getTodoById(id);
  if (!existing) return res.status(404).json({ error: "Not found" });

  const isOwner = existing.ownerId === uid;
  const isAssignee = existing.assigneeIds.includes(uid);
  const canEdit = isOwner || isAssignee;

  if (!canEdit) {
    return res.status(403).json({ error: "Not allowed" });
  }

  if (!isOwner && typeof req.body.assigneeIds !== "undefined") {
    return res.status(403).json({ error: "Only owner can change assignees" });
  }

  const updated = await updateTodo(id, req.body);
  res.json(updated);
});

// DELETE /api/todos/:id
router.delete("/:id", async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.uid;
  const { id } = req.params;

  const existing = await getTodoById(id);
  if (!existing) return res.status(404).json({ error: "Not found" });

  const isOwner = existing.ownerId === uid;
  if (!isOwner) {
    return res.status(403).json({ error: "Only owner can delete" });
  }

  await deleteTodo(id);
  res.status(204).send();
});

export default router;
