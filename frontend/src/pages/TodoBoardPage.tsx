import React, { useEffect, useState } from "react";
import { useApi } from "../lib/apiClient";
import { Todo } from "../types/todo";
import { AppUser } from "../types/user";
import { TodoCard } from "../components/TodoCard";
import { TodoEditor } from "../components/TodoEditor";
import { useAuth } from "../lib/authContext";

export const TodoBoardPage: React.FC = () => {
  const api = useApi();
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = async () => {
    setLoadingTodos(true);
    setError(null);
    try {
      const data = await api.get<Todo[]>("/api/todos");
      setTodos(data);
    } catch (e: any) {
      setError(e.message || "Failed to load todos");
    } finally {
      setLoadingTodos(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await api.get<AppUser[]>("/api/users");
      setUsers(data);
    } catch (e) {
      // user list is optional for viewing, so we do not set a global error here
      console.error("Failed to load users", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadTodos();
    loadUsers();
  }, []);

  const handleCreate = async (input: Partial<Todo>) => {
    try {
      const created = await api.post<Todo>("/api/todos", {
        title: input.title,
        content: input.content,
        type: input.type,
        checklist: input.checklist,
        color: input.color,
        labels: input.labels
      });
      setTodos((current) => [created, ...current]);
    } catch (e: any) {
      setError(e.message || "Failed to create todo");
    }
  };

  const handleUpdate = async (id: string, patch: Partial<Todo>) => {
    try {
      const updated = await api.patch<Todo>(`/api/todos/${id}`, patch);
      setTodos((current) => current.map((t) => (t.id === id ? updated : t)));
    } catch (e: any) {
      setError(e.message || "Failed to update todo");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.del<void>(`/api/todos/${id}`);
      setTodos((current) => current.filter((t) => t.id !== id));
    } catch (e: any) {
      setError(e.message || "Failed to delete todo");
    }
  };

  const currentUserUid = user?.uid || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 py-3 border-b bg-white flex justify-between items-center">
        <h1 className="text-lg font-bold">Collaborative Todo Board</h1>
        <div className="flex items-center gap-3 text-sm">
          {user?.email && <span>{user.email}</span>}
          <button
            onClick={() => logout()}
            className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="p-6 max-w-5xl mx-auto">
        <TodoEditor onCreate={handleCreate} />
        {error && (
          <div className="mb-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded px-3 py-2">
            {error}
          </div>
        )}
        {loadingTodos ? (
          <div>Loading notes...</div>
        ) : (
          <div className="grid gap-4 mt-4 md:grid-cols-3 sm:grid-cols-2">
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                allUsers={users}
                currentUserUid={currentUserUid}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {todos.length === 0 && (
              <p className="text-sm text-gray-500">
                No notes yet. Create one above.
              </p>
            )}
          </div>
        )}
        {loadingUsers && (
          <p className="text-xs text-gray-400 mt-2">
            Loading users for assignment...
          </p>
        )}
      </main>
    </div>
  );
};
