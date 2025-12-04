import React, { useState } from "react";
import { Todo, TodoType, ChecklistItem } from "../types/todo";

interface Props {
  onCreate(input: Partial<Todo>): void;
}

const COLORS = ["default", "yellow", "red", "green", "blue", "gray"];

export const TodoEditor: React.FC<Props> = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<TodoType>("TEXT");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [color, setColor] = useState<string>("default");
  const [labels, setLabels] = useState("");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setType("TEXT");
    setChecklist([]);
    setNewItemText("");
    setColor("default");
    setLabels("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle && !trimmedContent && checklist.length === 0) {
      return;
    }

    const payload: Partial<Todo> = {
      title: trimmedTitle || "(untitled)",
      content: type === "TEXT" ? trimmedContent : "",
      type,
      checklist: type === "CHECKLIST" ? checklist : [],
      color: color === "default" ? undefined : color,
      labels: labels
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
    };

    onCreate(payload);
    resetForm();
  };

  const addChecklistItem = () => {
    const text = newItemText.trim();
    if (!text) return;
    const item: ChecklistItem = {
      id: Math.random().toString(36).slice(2),
      text,
      checked: false
    };
    setChecklist((prev) => [...prev, item]);
    setNewItemText("");
  };

  const updateChecklistItem = (id: string, patch: Partial<ChecklistItem>) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-3 shadow-sm bg-white flex flex-col gap-3 mb-4"
    >
      <div className="flex gap-2 items-center">
        <input
          className="border rounded px-2 py-1 text-sm flex-1"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1 text-sm"
          value={type}
          onChange={(e) => setType(e.target.value as TodoType)}
        >
          <option value="TEXT">Note</option>
          <option value="CHECKLIST">Checklist</option>
        </select>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          {COLORS.map((c) => (
            <option key={c} value={c}>
              {c === "default" ? "Color" : c}
            </option>
          ))}
        </select>
      </div>

      {type === "TEXT" ? (
        <textarea
          className="border rounded px-2 py-1 text-sm"
          placeholder="Take a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              className="border rounded px-2 py-1 text-sm flex-1"
              placeholder="Checklist item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
            />
            <button
              type="button"
              onClick={addChecklistItem}
              className="text-sm px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
            >
              Add
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) =>
                    updateChecklistItem(item.id, { checked: e.target.checked })
                  }
                />
                <input
                  className="border rounded px-1 py-0.5 flex-1 text-sm"
                  value={item.text}
                  onChange={(e) =>
                    updateChecklistItem(item.id, { text: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => removeChecklistItem(item.id)}
                  className="text-xs text-red-500 underline"
                >
                  remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        className="border rounded px-2 py-1 text-xs"
        placeholder="Labels (comma separated, for example work, personal)"
        value={labels}
        onChange={(e) => setLabels(e.target.value)}
      />

      <button
        type="submit"
        className="self-start text-sm px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
      >
        Add note
      </button>
    </form>
  );
};
