import React, { useEffect, useState } from "react";
import { fetchLogs } from "../api";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);

  async function load() {
    try {
      const res = await fetchLogs();
      setLogs(res.logs);
    } catch (err) {
      alert("Error loading logs");
    }
  }

  useEffect(() => {
    load();
  }, []);

  function getClass(action) {
    if (action.includes("Create")) return "log-create";
    if (action.includes("Update")) return "log-update";
    return "log-delete";
  }

  return (
    <div>
      <h3>Audit Logs</h3>

      <table className="logs">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>Task ID</th>
            <th>Updated Content</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className={getClass(l.action)}>
              <td>{new Date(l.timestamp).toLocaleString()}</td>
              <td>{l.action}</td>
              <td>{l.taskId}</td>
              <td>
                {l.updatedContent ? (
                  Object.entries(l.updatedContent).map(
                    ([key, value]) => (
                      <div key={key}>
                        <strong>{key}</strong>: {value}
                      </div>
                    )
                  )
                ) : (
                  <em>-</em>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
