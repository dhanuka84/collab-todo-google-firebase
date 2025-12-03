import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import {
  listTodosForUser,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
} from '../services/todoService';

const router = Router();
router.use(authenticate);

// GET /api/todos
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.uid;
  const todos = await listTodosForUser(uid);
  res.json(todos);
});

// POST /api/todos
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.uid;
  const { title, description, assigneeIds } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = await createTodo({ title, description, assigneeIds }, uid);
  res.status(201).json(todo);
});

// PATCH /api/todos/:id
router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.uid;
  const { id } = req.params;

  const existing = await getTodoById(id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const canEdit = existing.ownerId === uid || existing.assigneeIds.includes(uid);
  if (!canEdit) return res.status(403).json({ error: 'Not allowed' });

  const updated = await updateTodo(id, req.body);
  res.json(updated);
});

// DELETE /api/todos/:id
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user!.uid;
  const { id } = req.params;

  const existing = await getTodoById(id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const canDelete = existing.ownerId === uid;
  if (!canDelete)
    return res.status(403).json({ error: 'Only owner can delete' });

  await deleteTodo(id);
  res.status(204).send();
});

export default router;
