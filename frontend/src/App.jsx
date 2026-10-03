import { useEffect, useState } from "react";

import {
  createTask,
  deleteTask,
  getTasks,
  toggleTask,
  updateTask,
} from "./api";


const emptyForm = { title: "", description: "" };

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      setTasks(await getTasks());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setSaving(true);
    setError("");
    const taskData = {
      title: form.title.trim(),
      description: form.description.trim(),
    };

    try {
      if (editingId) {
        const updatedTask = await updateTask(editingId, taskData);
        setTasks((current) =>
          current.map((task) =>
            task.id === editingId ? updatedTask : task,
          ),
        );
      } else {
        const newTask = await createTask(taskData);
        setTasks((current) => [newTask, ...current]);
      }
      cancelEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleToggle(id) {
    setError("");
    try {
      const updatedTask = await toggleTask(id);
      setTasks((current) =>
        current.map((task) => (task.id === id ? updatedTask : task)),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this task?")) return;

    setError("");
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page">
      <section className="card form-card">
        <h1>Task Manager</h1>
        <p className="intro">Add, edit, complete, or delete a task.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            maxLength="200"
            required
          />

          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add a few details"
            rows="3"
          />

          <div className="form-actions">
            <button className="primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Add task"}
            </button>
            {editingId && (
              <button className="secondary" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="tasks" aria-labelledby="tasks-heading">
        <div className="list-heading">
          <h2 id="tasks-heading">Your tasks</h2>
          <span>{tasks.length} total</span>
        </div>

        {error && <p className="message error">{error}</p>}
        {loading && <p className="message">Loading tasks...</p>}

        {!loading && !error && tasks.length === 0 && (
          <p className="message empty">No tasks yet. Add your first one above.</p>
        )}

        <div className="task-list">
          {tasks.map((task) => (
            <article className={`task ${task.completed ? "done" : ""}`} key={task.id}>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task.id)}
                />
                <span>
                  <strong>{task.title}</strong>
                  {task.description && <small>{task.description}</small>}
                </span>
              </label>
              <div className="task-actions">
                <button type="button" onClick={() => startEdit(task)}>
                  Edit
                </button>
                <button className="delete" type="button" onClick={() => handleDelete(task.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
