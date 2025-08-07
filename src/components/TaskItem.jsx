import React from "react";
import { Pencil, Trash2, Save } from "lucide-react";

export default function TaskItem({ task, onToggle, onDelete, onEdit, isEditing, editText, setEditText, onSaveEdit }) {
  return (
    <div className={`task-item ${task.done ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={onToggle}
      />
      {isEditing ? (
        <>
          <input
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSaveEdit()}
            autoFocus
          />
          <button className="save-btn" onClick={onSaveEdit} title="Save">
            <Save size={18} />
          </button>
        </>
      ) : (
        <>
          <span>{task.text}</span>
          <div>
            <button className="edit-btn" onClick={onEdit} title="Edit">
              <Pencil size={18} />
            </button>
            <button className="delete-btn" onClick={onDelete} title="Delete">
              <Trash2 size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
