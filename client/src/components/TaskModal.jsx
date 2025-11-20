import React, { useState } from "react";

export default function TaskModal({
  task,
  onCreate,
  onUpdate,
  onClose,
}) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(
    task?.description || ""
  );

  function save() {
    if (!title.trim()) return alert("Title required");
    if (!description.trim()) return alert("Description required");

    const data = { title, description };

    if (task) onUpdate(task.id, data);
    else onCreate(data);
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{task ? "Edit Task" : "Create Task"}</h3>

        <label>Title</label>
        <input
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>
        <textarea
          value={description}
          maxLength={500}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={save}>{task ? "Save" : "Create"}</button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
