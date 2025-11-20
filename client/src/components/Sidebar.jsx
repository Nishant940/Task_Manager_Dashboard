import React from "react";

export default function Sidebar({ route, setRoute }) {
  return (
    <aside className="sidebar">
      <nav>
        <button
          className={route === "tasks" ? "active" : ""}
          onClick={() => setRoute("tasks")}
        >
          Tasks
        </button>

        <button
          className={route === "logs" ? "active" : ""}
          onClick={() => setRoute("logs")}
        >
          Audit Logs
        </button>
      </nav>
    </aside>
  );
}
