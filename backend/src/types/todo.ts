export type TodoStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  ownerId: string;
  assigneeIds: string[];
  createdAt: string;
  updatedAt: string;
  visibleTo: string[];
}
