import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TasksPage from "./components/TasksPage";
import LogsPage from "./components/LogsPage";

export default function App() {
  const [route, setRoute] = useState("tasks");

  return (
    <div className="app">
      <Sidebar route={route} setRoute={setRoute} />

      <div className="main">
        <header className="topbar">
          <h2>Task Manager Dashboard</h2>
        </header>

        <div className="content">
          {route === "tasks" ? <TasksPage /> : <LogsPage />}
        </div>
      </div>
    </div>
  );
}
