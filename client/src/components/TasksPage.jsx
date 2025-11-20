import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api";
import TaskModal from "./TaskModal";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchTasks(page, filter);

      // FIX: Ensure tasks is ALWAYS an array
      let finalTasks = [];

      if (Array.isArray(res)) {
        // backend returned an array
        finalTasks = res;
      } else if (Array.isArray(res.tasks)) {
        // backend returned { tasks: [...] }
        finalTasks = res.tasks;
      } else {
        console.warn("Unexpected tasks API response:", res);
      }

      setTasks(finalTasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
      alert(err.error || "Error loading tasks");
      setTasks([]); // Prevent crashes
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [page, filter]);

  async function handleCreate(data) {
    await createTask(data);
    setShowModal(false);
    setPage(1);
    load();
  }

  async function handleUpdate(id, data) {
    await updateTask(id, data);
    setEditing(null);
    setShowModal(false);
    load();
  }

  async function handleDelete(id) {
    if (confirm("Delete this task?")) {
      await deleteTask(id);
      load();
    }
  }

  return (
    <div>
      <div className="controls">
        <input
          placeholder="Search title/description"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
        >
          Create Task
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="tasks">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.title}</td>
                <td>{t.description}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditing(t);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {showModal && (
        <TaskModal
          task={editing}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
