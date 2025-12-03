import React, { useState } from 'react';

interface Props {
  onCreate(title: string, description?: string): void;
}

export const TodoEditor: React.FC<Props> = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim(), description.trim() || undefined);
    setTitle('');
    setDescription('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-3 shadow-sm bg-white flex flex-col gap-2 mb-4"
    >
      <input
        className="border rounded px-2 py-1 text-sm"
        placeholder="New todo title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border rounded px-2 py-1 text-sm"
        placeholder="Optional description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="self-start text-sm px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
      >
        Add
      </button>
    </form>
  );
};
