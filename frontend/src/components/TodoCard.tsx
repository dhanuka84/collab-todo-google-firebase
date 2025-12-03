import React from 'react';
import { Todo } from '../types/todo';

interface Props {
  todo: Todo;
  onUpdate(id: string, patch: Partial<Todo>): void;
  onDelete(id: string): void;
}

export const TodoCard: React.FC<Props> = ({ todo, onUpdate, onDelete }) => {
  const toggleStatus = () => {
    const next =
      todo.status === 'OPEN'
        ? 'IN_PROGRESS'
        : todo.status === 'IN_PROGRESS'
        ? 'DONE'
        : 'OPEN';
    onUpdate(todo.id, { status: next });
  };

  return (
    <div className="border rounded-lg p-3 shadow-sm bg-white flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <h2 className="font-semibold text-sm">{todo.title}</h2>
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
          {todo.status}
        </span>
      </div>
      {todo.description && (
        <p className="text-xs text-gray-700 whitespace-pre-line">
          {todo.description}
        </p>
      )}
      <div className="mt-auto flex gap-2 text-xs text-gray-500">
        <button onClick={toggleStatus} className="underline">
          Next status
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="underline text-red-500 ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
