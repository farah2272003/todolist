import React, { useState, useEffect } from "react";
import TaskItem from "./components/TaskItem";
import { Sun, Moon, ListTodo } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleAddTask = () => {
    const trimmed = input.trim();
    if (trimmed.length < 5) {
      setError("Task must be at least 5 characters.");
      return;
    }
    setTasks([...tasks, { id: Date.now(), text: trimmed, done: false }]);
    setInput("");
    setError("");
  };

  const handleToggle = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        toast.success(
          <>
            <CheckCircle2 size={18} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Task Completed: {task.text}
          </>,
          { autoClose: 2000 }
        );
        return { ...task, done: !task.done };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEdit = (id) => {
    setEditingId(id);
    const currentTask = tasks.find(task => task.id === id);
    setEditText(currentTask.text);
  };

  const handleSaveEdit = (id) => {
    if (editText.trim().length < 5) {
      toast.error("Edit must be at least 5 characters.");
      return;
    }
    setTasks(tasks.map(task => task.id === id ? { ...task, text: editText.trim() } : task));
    setEditingId(null);
    setEditText("");
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.done;
    if (filter === "done") return task.done;
    return true;
  });

  return (
    <div className="wrapper">
      <div className="todo-container">
        <div className="header">
          <h1 className="title">
            <ListTodo size={28} className="icon-title" /> My ToDo List
          </h1>
          <button className="theme-toggle" onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
            {theme === "light" ? (
              <><Moon size={20} /> <span>Dark Mode</span></>
            ) : (
              <><Sun size={20} /> <span>Light Mode</span></>
            )}
          </button>
        </div>

        <input
          className="task-input"
          type="text"
          placeholder="Create new task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
        />

        {error && <p className="error">{error}</p>}

        <div className="filters">
          <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
          <button onClick={() => setFilter("active")} className={filter === "active" ? "active" : ""}>Active</button>
          <button onClick={() => setFilter("done")} className={filter === "done" ? "active" : ""}>Done</button>
        </div>

        <ul className="task-list">
          <AnimatePresence>
            {filteredTasks.map(task => (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <TaskItem
                  task={task}
                  onToggle={() => handleToggle(task.id)}
                  onDelete={() => handleDelete(task.id)}
                  onEdit={() => handleEdit(task.id)}
                  isEditing={editingId === task.id}
                  editText={editText}
                  setEditText={setEditText}
                  onSaveEdit={() => handleSaveEdit(task.id)}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
