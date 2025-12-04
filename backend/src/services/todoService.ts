import { db } from "../config/firebase";
import { Todo, TodoStatus, TodoType, ChecklistItem } from "../types/todo";

const todosCollection = db.collection("todos");

export async function listTodosForUser(userId: string): Promise<Todo[]> {
  const snapshot = await todosCollection
    .where("visibleTo", "array-contains", userId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...(doc.data() as Omit<Todo, "id">) } as Todo)
  );
}

export interface CreateTodoInput {
  title: string;
  content?: string;
  description?: string;
  type?: TodoType;
  checklist?: ChecklistItem[];
  color?: string;
  labels?: string[];
  status?: TodoStatus;
  assigneeIds?: string[];
}

export async function createTodo(
  input: CreateTodoInput,
  ownerId: string
): Promise<Todo> {
  const now = new Date().toISOString();
  const assigneeIds = input.assigneeIds ?? [];
  const visibleTo = Array.from(new Set([ownerId, ...assigneeIds]));

  const type: TodoType = input.type ?? "TEXT";
  const status: TodoStatus = input.status ?? "OPEN";

  const docRef = await todosCollection.add({
    title: input.title,
    description: input.description ?? "",
    content: input.content ?? "",
    type,
    checklist: input.checklist ?? [],
    color: input.color ?? null,
    labels: input.labels ?? [],
    status,
    ownerId,
    assigneeIds,
    visibleTo,
    createdAt: now,
    updatedAt: now
  });

  const snapshot = await docRef.get();
  return { id: snapshot.id, ...(snapshot.data() as Omit<Todo, "id">) } as Todo;
}

export interface UpdateTodoInput {
  title?: string;
  content?: string;
  description?: string;
  type?: TodoType;
  checklist?: ChecklistItem[];
  color?: string;
  labels?: string[];
  status?: TodoStatus;
  assigneeIds?: string[];
}

export async function getTodoById(id: string): Promise<Todo | null> {
  const doc = await todosCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as Omit<Todo, "id">) } as Todo;
}

export async function updateTodo(
  id: string,
  input: UpdateTodoInput
): Promise<Todo | null> {
  const existing = await getTodoById(id);
  if (!existing) return null;

  const assigneeIds = input.assigneeIds ?? existing.assigneeIds;
  const ownerId = existing.ownerId;
  const visibleTo = Array.from(new Set([ownerId, ...assigneeIds]));

  const updateData = {
    ...input,
    assigneeIds,
    visibleTo,
    updatedAt: new Date().toISOString()
  };

  await todosCollection.doc(id).update(updateData);

  const updated = await getTodoById(id);
  return updated;
}

export async function deleteTodo(id: string): Promise<void> {
  await todosCollection.doc(id).delete();
}
