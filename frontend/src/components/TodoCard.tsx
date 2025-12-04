import React, { useState } from "react";
import { Todo, ChecklistItem } from "../types/todo";
import { AppUser } from "../types/user";

interface Props {
  todo: Todo;
  allUsers: AppUser[];
  currentUserUid: string;
  onUpdate(id: string, patch: Partial<Todo>): void;
  onDelete(id: string): void;
}

function cardBackground(color?: string): string {
  switch (color) {
    case "yellow":
      return "bg-yellow-50";
    case "red":
      return "bg-red-50";
    case "green":
      return "bg-green-50";
    case "blue":
      return "bg-blue-50";
    case "gray":
      return "bg-gray-100";
    default:
      return "bg-white";
  }
}

export const TodoCard: React.FC<Props> = ({
  todo,
  allUsers,
  currentUserUid,
  onUpdate,
  onDelete
}) => {
  const [showAssign, setShowAssign] = useState(false);
  const [pendingAssignees, setPendingAssignees] = useState<string[]>(
    todo.assigneeIds
  );

  const toggleStatus = () => {
    const next =
      todo.status === "OPEN"
        ? "IN_PROGRESS"
        : todo.status === "IN_PROGRESS"
        ? "DONE"
        : "OPEN";
    onUpdate(todo.id, { status: next });
  };

  const toggleChecklistItem = (itemId: string) => {
    if (!todo.checklist) return;
    const updated = todo.checklist.map((item: ChecklistItem) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    onUpdate(todo.id, { checklist: updated });
  };

  const backgroundClass = cardBackground(todo.color);
  const labels = todo.labels ?? [];
  const isOwner = todo.ownerId === currentUserUid;

  const toggleAssignee = (uid: string) => {
    setPendingAssignees((prev) =>
      prev.includes(uid) ? prev.filter((id) => id != uid) : [...prev, uid]
    );
  };

  const saveAssignees = () => {
    onUpdate(todo.id, { assigneeIds: pendingAssignees });
    setShowAssign(false);
  };

  const cancelAssignees = () => {
    setPendingAssignees(todo.assigneeIds);
    setShowAssign(false);
  };

  const assigneeDisplay = allUsers.filter((u) =>
    todo.assigneeIds.includes(u.uid)
  );

  return (
    <div
      className={
        "border rounded-lg p-3 shadow-sm flex flex-col gap-2 " + backgroundClass
      }
    >
      <div className="flex justify-between items-start">
        <h2 className="font-semibold text-sm">
          {todo.title || "(untitled)"}
        </h2>
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
          {todo.status}
        </span>
      </div>

      {todo.type === "TEXT" && (todo.content || todo.description) && (
        <p className="text-xs text-gray-700 whitespace-pre-line">
          {todo.content || todo.description}
        </p>
      )}

      {todo.type === "CHECKLIST" &&
        todo.checklist &&
        todo.checklist.length > 0 && (
          <ul className="text-xs text-gray-800 space-y-1">
            {todo.checklist.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleChecklistItem(item.id)}
                />
                <span
                  className={
                    item.checked ? "line-through text-gray-500" : ""
                  }
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        )}

      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {labels.map((label) => (
            <span
              key={label}
              className="text-[10px] px-2 py-0.5 border rounded-full bg-white text-gray-700"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {assigneeDisplay.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-gray-700">
          <span>Shared with:</span>
          {assigneeDisplay.map((u) => (
            <span key={u.uid} className="px-1">
              {u.displayName || u.email || u.uid}
            </span>
          ))}
        </div>
      )}

      {isOwner && (
        <div className="mt-1">
          {!showAssign ? (
            <button
              type="button"
              onClick={() => setShowAssign(true)}
              className="text-xs underline text-blue-600"
            >
              Assign users
            </button>
          ) : (
            <div className="border rounded p-2 bg-white mt-1 text-xs">
              <div className="mb-1 font-semibold">Assign to:</div>
              <div className="max-h-40 overflow-auto flex flex-col gap-1">
                {allUsers
                  .filter((u) => u.uid !== todo.ownerId)
                  .map((u) => {
                    const label = u.displayName || u.email || u.uid;
                    const checked = pendingAssignees.includes(u.uid);
                    return (
                      <label key={u.uid} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAssignee(u.uid)}
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
              </div>
              <div className="mt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={cancelAssignees}
                  className="px-2 py-1 border rounded bg-gray-100 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveAssignees}
                  className="px-2 py-1 border rounded bg-gray-200 text-xs"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-2 flex gap-2 text-xs text-gray-500">
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
