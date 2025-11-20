// client/src/api.js
const API_BASE = "http://localhost:4000/api";
const AUTH = "Basic " + btoa("admin:password123");

async function request(path, opts = {}) {
  const headers = {
    Authorization: AUTH,
    ...(opts.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const text = await res.text();
  // try parse JSON when possible
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    throw new Error("Invalid JSON from server: " + text);
  }
  if (!res.ok) throw data || { error: "Request failed" };
  return data;
}

export const fetchTasks = (page = 1, filter = "") => request(`/tasks?page=${page}&filter=${encodeURIComponent(filter)}`);
export const createTask = (payload) => request("/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
export const updateTask = (id, payload) => request(`/tasks/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });
export const fetchLogs = (page = 1, limit = 100) => request(`/logs?page=${page}&limit=${limit}`);
