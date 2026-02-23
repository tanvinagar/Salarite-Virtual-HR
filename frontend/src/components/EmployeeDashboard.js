import React, { useState, useEffect } from "react";
import axios from "axios";

function EmployerDashboard() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [candidate, setCandidate] = useState("");
  const [hrName, setHrName] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([]);

  const fetchTasks = () => {
    axios.get("http://127.0.0.1:8000/tasks")
      .then(res => setTasks(res.data));
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  const assignTask = async () => {
    await axios.post("http://127.0.0.1:8000/tasks", {
      title,
      description,
      candidate_name: candidate,
      hr_name: hrName,
      priority,
      deadline
    });

    setTitle("");
    setDescription("");
    setCandidate("");
    setHrName("");
    setPriority("");
    setDeadline("");
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/tasks/${id}`);
  };

  return (
    <div style={{ padding: 30, background: "#f4f6f9", minHeight: "100vh" }}>

      <h2 style={{ textAlign: "center" }}>Employer Dashboard</h2>

      <div style={card}>
        <h3>Assign Task</h3>

        <input placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input placeholder="Candidate Name" value={candidate} onChange={e => setCandidate(e.target.value)} />
        <input placeholder="HR Name" value={hrName} onChange={e => setHrName(e.target.value)} />

        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="">Priority</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <input
          type="datetime-local"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />

        <button onClick={assignTask}>Assign Task</button>
      </div>

      <h3>All Tasks</h3>

      {tasks.map(task => (
        <div key={task.id} style={card}>
          <b>{task.title}</b> — {task.candidate_name} → HR: {task.hr_name} <br />

          <p><b>Description:</b> {task.description}</p>

          <b>Priority:</b> {task.priority} <br />
          <b>Status:</b> {task.status} <br />
          <b>Deadline:</b> {task.deadline} <br />

          <button onClick={() => deleteTask(task.id)}>Delete Task</button>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "white",
  padding: 20,
  margin: "15px 0",
  borderRadius: 10,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

export default EmployerDashboard;