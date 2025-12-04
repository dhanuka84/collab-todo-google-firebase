export type TodoStatus = "OPEN" | "IN_PROGRESS" | "DONE";
export type TodoType = "TEXT" | "CHECKLIST";

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  content?: string;
  type: TodoType;
  checklist?: ChecklistItem[];
  color?: string;
  labels?: string[];
  status: TodoStatus;
  ownerId: string;
  assigneeIds: string[];
  visibleTo: string[];
  createdAt: string;
  updatedAt: string;
}
